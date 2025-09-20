import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';
import { uploadAndProcessDocument } from '../services/documentProcessor';
import { deleteDocumentCall } from '../services/firebase';
import { useEffect, useState } from 'react';

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  filePath: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  uploadedAt: any;
  userId: string;
  error?: string;
  chunkCount?: number;
  processedAt?: any;
}

export const useDocuments = () => {
  const queryClient = useQueryClient();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'documents'),
      where('userId', '==', user.uid),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Document[];

        console.log('Documents updated:', docs);
        setDocuments(docs);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error listening to documents:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const uploadMutation = useMutation({
    mutationFn: uploadAndProcessDocument,
    onSuccess: () => {
      console.log('Document uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      console.error('Error uploading document:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      try {
        await deleteDocumentCall({ documentId });
      } catch (error) {
        console.warn('Error calling delete function, continuing with local cleanup:', error);
      }

      try {
        const storageRef = ref(storage, document.filePath);
        await deleteObject(storageRef);
      } catch (error) {
        console.warn('Error deleting from storage:', error);
      }

      await deleteDoc(doc(db, 'documents', documentId));

      return documentId;
    },
    onSuccess: (deletedId) => {
      console.log('Document deleted successfully:', deletedId);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      console.error('Error deleting document:', error);
    }
  });

  const getDocumentsByStatus = (status: Document['status']) => {
    return documents.filter(doc => doc.status === status);
  };

  const getReadyDocuments = () => {
    return documents.filter(doc => doc.status === 'ready');
  };

  const getProcessingDocuments = () => {
    return documents.filter(doc => ['uploading', 'processing'].includes(doc.status));
  };

  const getErrorDocuments = () => {
    return documents.filter(doc => doc.status === 'error');
  };

  return {
    documents,
    isLoading,
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    // Helper functions
    getDocumentsByStatus,
    getReadyDocuments,
    getProcessingDocuments,
    getErrorDocuments,

    // Stats
    totalDocuments: documents.length,
    readyDocuments: getReadyDocuments().length,
    processingDocuments: getProcessingDocuments().length,
    errorDocuments: getErrorDocuments().length,
  };
};