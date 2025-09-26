import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db, auth } from '../config/firebase';
import { processDocumentCall } from './firebase';

export interface DocumentUploadResult {
  documentId: string;
  downloadURL: string;
  fileName: string;
}

export const uploadAndProcessDocument = async (file: File): Promise<DocumentUploadResult> => {
  try {
    const user = auth.currentUser;

    // Requerir autenticación real
    if (!user) {
      throw new Error('Debes iniciar sesión para subir documentos');
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `uploads/${fileName}`;

    console.log('Uploading file to Storage:', fileName);

    const storageRef = ref(storage, filePath);

    console.log('Starting upload to Firebase Storage...');
    const uploadPromise = uploadBytes(storageRef, file);
    const uploadTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
    );

    const snapshot = await Promise.race([uploadPromise, uploadTimeout]) as any;
    console.log('Upload completed, getting download URL...');

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadURL);

    console.log('File uploaded successfully, creating Firestore document...');

    const docRef = await addDoc(collection(db, 'documents'), {
      name: file.name,
      size: file.size,
      type: file.type,
      url: downloadURL,
      filePath: snapshot.ref.fullPath,
      status: 'uploading',
      uploadedAt: serverTimestamp(),
      userId: user.uid,
      error: null,
      chunkCount: 0,
      processedAt: null
    });

    console.log('Document created in Firestore:', docRef.id);

    console.log('Updating document status to processing...');
    await updateDoc(doc(db, 'documents', docRef.id), {
      status: 'processing'
    });

    console.log('Processing document with Cloud Function...');
    console.log('Function call parameters:', {
      documentId: docRef.id,
      filePath: snapshot.ref.fullPath,
      fileName: file.name,
      fileType: file.type,
      userId: user.uid
    });

    try {
      // Timeout después de 60 segundos
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Cloud Function taking too long')), 60000)
      );

      console.log('Calling processDocumentCall...');
      const processPromise = processDocumentCall({
        documentId: docRef.id,
        filePath: snapshot.ref.fullPath,
        fileName: file.name,
        fileType: file.type,
        userId: user.uid
      });
      console.log('processDocumentCall initiated');

      const result = await Promise.race([processPromise, timeoutPromise]);

      console.log('Document processed successfully:', result);

      await updateDoc(doc(db, 'documents', docRef.id), {
        status: 'ready',
        processedAt: serverTimestamp()
      });
    } catch (processingError) {
      console.error('Error processing document:', processingError);

      await updateDoc(doc(db, 'documents', docRef.id), {
        status: 'error',
        error: processingError instanceof Error ? processingError.message : 'Unknown processing error'
      });

      throw processingError;
    }

    return {
      documentId: docRef.id,
      downloadURL,
      fileName: file.name
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

export const isValidFileType = (file: File): boolean => {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  return validTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};