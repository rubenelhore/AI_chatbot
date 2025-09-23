"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.testFunction = exports.chatQuery = exports.processDocument = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const pinecone_1 = require("@pinecone-database/pinecone");
const generative_ai_1 = require("@google/generative-ai");
const textProcessor_1 = require("./utils/textProcessor");
admin.initializeApp();
const PINECONE_API_KEY = ((_a = functions.config().pinecone) === null || _a === void 0 ? void 0 : _a.api_key) || '';
const PINECONE_INDEX_NAME = ((_b = functions.config().pinecone) === null || _b === void 0 ? void 0 : _b.index_name) || 'document-chatbot';
const GEMINI_API_KEY = ((_c = functions.config().gemini) === null || _c === void 0 ? void 0 : _c.api_key) || '';
const pinecone = new pinecone_1.Pinecone({
    apiKey: PINECONE_API_KEY,
});
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
exports.processDocument = functions
    .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
})
    .https.onCall(async (data, context) => {
    console.log('processDocument function started with data:', JSON.stringify(data, null, 2));
    console.log('Auth context:', JSON.stringify(context.auth, null, 2));
    console.log('Environment check:', {
        hasPineconeKey: !!PINECONE_API_KEY,
        hasGeminiKey: !!GEMINI_API_KEY,
        pineconeIndex: PINECONE_INDEX_NAME,
    });
    // Verificar autenticación
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to process documents');
    }
    const userId = context.auth.uid;
    try {
        const { documentId, filePath, fileName } = data;
        if (!documentId || !filePath) {
            throw new functions.https.HttpsError('invalid-argument', 'Document ID and file path are required');
        }
        console.log(`Processing document: ${documentId} from path: ${filePath}`);
        const bucket = admin.storage().bucket();
        const file = bucket.file(filePath);
        const [fileBuffer] = await file.download();
        let text = await (0, textProcessor_1.extractTextFromFile)(fileBuffer, fileName);
        text = (0, textProcessor_1.preprocessText)(text);
        if (!text || text.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'No text content found in document');
        }
        const chunks = (0, textProcessor_1.chunkText)(text, 1000, 200);
        console.log(`Document split into ${chunks.length} chunks`);
        const index = pinecone.Index(PINECONE_INDEX_NAME);
        const model = genAI.getGenerativeModel({ model: 'embedding-001' });
        const vectors = [];
        const batchSize = 10;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, Math.min(i + batchSize, chunks.length));
            const embeddings = await Promise.all(batch.map(async (chunk, idx) => {
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
            }));
            vectors.push(...embeddings);
        }
        // Usar el userId como namespace en Pinecone para aislar los datos
        await index.namespace(`user-${userId}`).upsert(vectors);
        await admin.firestore().collection('documents').doc(documentId).update({
            status: 'processed',
            chunkCount: chunks.length,
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
            textLength: text.length,
            userId: userId, // Asociar documento con el usuario
        });
        return {
            success: true,
            chunkCount: chunks.length,
        };
    }
    catch (error) {
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
        throw new functions.https.HttpsError('internal', 'Error processing document');
    }
});
exports.chatQuery = functions
    .runWith({
    timeoutSeconds: 60,
    memory: '1GB',
})
    .https.onCall(async (data, context) => {
    // Verificar autenticación
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to chat');
    }
    const userId = context.auth.uid;
    try {
        const { query, documentIds } = data;
        if (!query || !documentIds || documentIds.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'Query and document IDs are required');
        }
        console.log(`Processing query: "${query}" for documents: ${documentIds.join(', ')}`);
        const model = genAI.getGenerativeModel({ model: 'embedding-001' });
        const queryEmbedding = await model.embedContent(query);
        const index = pinecone.Index(PINECONE_INDEX_NAME);
        // Buscar solo en el namespace del usuario
        const searchResults = await index.namespace(`user-${userId}`).query({
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
            var _a;
            const text = (_a = match.metadata) === null || _a === void 0 ? void 0 : _a.text;
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
            sources: searchResults.matches.map((match) => {
                var _a, _b;
                return ({
                    documentId: ((_a = match.metadata) === null || _a === void 0 ? void 0 : _a.documentId) || '',
                    chunkIndex: ((_b = match.metadata) === null || _b === void 0 ? void 0 : _b.chunkIndex) || 0,
                    score: match.score || 0,
                });
            }),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userId: userId,
            conversationId: data.conversationId,
        });
        return {
            response,
            sources: searchResults.matches.map((match) => {
                var _a, _b, _c;
                return ({
                    documentId: String(((_a = match.metadata) === null || _a === void 0 ? void 0 : _a.documentId) || ''),
                    chunkIndex: Number(((_b = match.metadata) === null || _b === void 0 ? void 0 : _b.chunkIndex) || 0),
                    score: match.score || 0,
                    text: String(((_c = match.metadata) === null || _c === void 0 ? void 0 : _c.text) || ''),
                });
            }),
            chatId: chatDoc.id,
        };
    }
    catch (error) {
        console.error('Error in chat query:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Error processing chat query');
    }
});
exports.testFunction = functions.https.onCall(async (data, context) => {
    console.log('Test function called with data:', JSON.stringify(data));
    console.log('Auth context:', JSON.stringify(context.auth));
    return { message: 'Test function works!', timestamp: new Date().toISOString() };
});
exports.deleteDocument = functions.https.onCall(async (data, context) => {
    // Verificar autenticación
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to delete documents');
    }
    const userId = context.auth.uid;
    try {
        const { documentId } = data;
        if (!documentId) {
            throw new functions.https.HttpsError('invalid-argument', 'Document ID is required');
        }
        console.log(`Deleting document vectors: ${documentId}`);
        const index = pinecone.Index(PINECONE_INDEX_NAME);
        const docRef = await admin
            .firestore()
            .collection('documents')
            .doc(documentId)
            .get();
        if (!docRef.exists) {
            throw new functions.https.HttpsError('not-found', 'Document not found');
        }
        const docData = docRef.data();
        // Verificar que el documento pertenece al usuario
        if ((docData === null || docData === void 0 ? void 0 : docData.userId) !== userId) {
            throw new functions.https.HttpsError('permission-denied', 'You do not have permission to delete this document');
        }
        const chunkCount = (docData === null || docData === void 0 ? void 0 : docData.chunkCount) || 0;
        const vectorIds = [];
        for (let i = 0; i < chunkCount; i++) {
            vectorIds.push(`${documentId}_chunk_${i}`);
        }
        if (vectorIds.length > 0) {
            // Eliminar del namespace del usuario
            await index.namespace(`user-${userId}`).deleteMany(vectorIds);
        }
        await admin.firestore().collection('documents').doc(documentId).delete();
        return {
            success: true,
            deletedVectors: vectorIds.length,
        };
    }
    catch (error) {
        console.error('Error deleting document:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Error deleting document');
    }
});
//# sourceMappingURL=index.js.map