import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  extractTextFromFile,
  chunkText,
  preprocessText,
} from './utils/textProcessor';
import {
  DocumentData,
  ChatQuery,
  ChatResponse,
  ProcessingResult,
  VectorRecord,
} from './types';

admin.initializeApp();

const PINECONE_API_KEY = functions.config().pinecone?.api_key || '';
const PINECONE_INDEX_NAME = functions.config().pinecone?.index_name || 'document-chatbot';
const GEMINI_API_KEY = functions.config().gemini?.api_key || '';

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const processDocument = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall(async (data: DocumentData, context): Promise<ProcessingResult> => {
    console.log('processDocument function started with data:', JSON.stringify(data, null, 2));
    console.log('Auth context:', JSON.stringify(context.auth, null, 2));
    console.log('Environment check:', {
      hasPineconeKey: !!PINECONE_API_KEY,
      hasGeminiKey: !!GEMINI_API_KEY,
      pineconeIndex: PINECONE_INDEX_NAME,
    });

    try {
      const { documentId, filePath, fileName } = data;

      if (!documentId || !filePath) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Document ID and file path are required'
        );
      }

      console.log(`Processing document: ${documentId} from path: ${filePath}`);

      const bucket = admin.storage().bucket();
      const file = bucket.file(filePath);
      const [fileBuffer] = await file.download();

      let text = await extractTextFromFile(fileBuffer, fileName);
      text = preprocessText(text);

      if (!text || text.length === 0) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'No text content found in document'
        );
      }

      const chunks = chunkText(text, 1000, 200);
      console.log(`Document split into ${chunks.length} chunks`);

      const index = pinecone.Index(PINECONE_INDEX_NAME);
      const model = genAI.getGenerativeModel({ model: 'embedding-001' });

      const vectors: VectorRecord[] = [];
      const batchSize = 10;

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, Math.min(i + batchSize, chunks.length));
        const embeddings = await Promise.all(
          batch.map(async (chunk, idx) => {
            const result = await model.embedContent(chunk);
            return {
              id: `${documentId}_chunk_${i + idx}`,
              values: result.embedding.values,
              metadata: {
                documentId,
                chunkIndex: i + idx,
                text: chunk.substring(0, 1000),
                chunkCount: chunks.length,
                fileName,
              },
            };
          })
        );
        vectors.push(...embeddings);
      }

      await index.namespace('documents').upsert(vectors);

      await admin.firestore().collection('documents').doc(documentId).update({
        status: 'processed',
        chunkCount: chunks.length,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        textLength: text.length,
      });

      return {
        success: true,
        chunkCount: chunks.length,
      };
    } catch (error) {
      console.error('Error processing document:', error);

      if (data.documentId) {
        await admin
          .firestore()
          .collection('documents')
          .doc(data.documentId)
          .update({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
      }

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Error processing document'
      );
    }
  });

export const chatQuery = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '1GB',
  })
  .https.onCall(async (data: ChatQuery, context): Promise<ChatResponse> => {
    try {
      const { query, documentIds } = data;

      if (!query || !documentIds || documentIds.length === 0) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Query and document IDs are required'
        );
      }

      console.log(`Processing query: "${query}" for documents: ${documentIds.join(', ')}`);

      const model = genAI.getGenerativeModel({ model: 'embedding-001' });
      const queryEmbedding = await model.embedContent(query);

      const index = pinecone.Index(PINECONE_INDEX_NAME);
      const searchResults = await index.namespace('documents').query({
        vector: queryEmbedding.embedding.values,
        topK: 5,
        includeMetadata: true,
        filter: {
          documentId: { $in: documentIds },
        },
      });

      if (!searchResults.matches || searchResults.matches.length === 0) {
        return {
          response: 'No encontré información relevante en los documentos proporcionados para responder tu pregunta.',
          sources: [],
          chatId: '',
        };
      }

      const context = searchResults.matches
        .map((match) => {
          const text = match.metadata?.text;
          return typeof text === 'string' ? text : '';
        })
        .filter((text) => text.length > 0)
        .join('\n\n---\n\n');

      // Updated to use the latest Gemini model
      const chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
Eres un asistente experto que responde preguntas basándote únicamente en el contexto proporcionado.

Contexto de los documentos:
${context}

Pregunta del usuario: ${query}

Instrucciones:
1. Responde basándote ÚNICAMENTE en el contexto proporcionado
2. Si no encuentras información relevante, dilo claramente
3. Incluye citas específicas cuando sea apropiado
4. Sé conciso pero informativo
5. Responde en español
6. Si la información está incompleta, menciona qué falta

Respuesta:`;

      const result = await chatModel.generateContent(prompt);
      const response = result.response.text();

      const chatDoc = await admin.firestore().collection('chats').add({
        query,
        response,
        documentIds,
        sources: searchResults.matches.map((match) => ({
          documentId: match.metadata?.documentId || '',
          chunkIndex: match.metadata?.chunkIndex || 0,
          score: match.score || 0,
        })),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        userId: (context as any).auth?.uid || 'anonymous',
        conversationId: data.conversationId,
      });

      return {
        response,
        sources: searchResults.matches.map((match) => ({
          documentId: String(match.metadata?.documentId || ''),
          chunkIndex: Number(match.metadata?.chunkIndex || 0),
          score: match.score || 0,
          text: String(match.metadata?.text || ''),
        })),
        chatId: chatDoc.id,
      };
    } catch (error) {
      console.error('Error in chat query:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Error processing chat query'
      );
    }
  });

export const testFunction = functions.https.onCall(async (data, context) => {
  console.log('Test function called with data:', JSON.stringify(data));
  console.log('Auth context:', JSON.stringify(context.auth));
  return { message: 'Test function works!', timestamp: new Date().toISOString() };
});

export const deleteDocument = functions.https.onCall(
  async (data: { documentId: string }) => {
    try {
      const { documentId } = data;

      if (!documentId) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Document ID is required'
        );
      }

      console.log(`Deleting document vectors: ${documentId}`);

      const index = pinecone.Index(PINECONE_INDEX_NAME);

      const docRef = await admin
        .firestore()
        .collection('documents')
        .doc(documentId)
        .get();

      if (!docRef.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Document not found'
        );
      }

      const docData = docRef.data();
      const chunkCount = docData?.chunkCount || 0;

      const vectorIds = [];
      for (let i = 0; i < chunkCount; i++) {
        vectorIds.push(`${documentId}_chunk_${i}`);
      }

      if (vectorIds.length > 0) {
        await index.namespace('documents').deleteMany(vectorIds);
      }

      await admin.firestore().collection('documents').doc(documentId).delete();

      return {
        success: true,
        deletedVectors: vectorIds.length,
      };
    } catch (error) {
      console.error('Error deleting document:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Error deleting document'
      );
    }
  }
);