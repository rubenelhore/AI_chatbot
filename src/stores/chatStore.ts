import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatQueryCall } from '../services/firebase';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    documentId: string;
    chunkIndex: number;
    score: number;
    text?: string;
  }>;
  isError?: boolean;
}

export interface DocumentRef {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  selectedDocuments: string[];
  conversationId: string | null;

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendQuery: (query: string) => Promise<void>;
  setSelectedDocuments: (docs: string[]) => void;
  clearMessages: () => void;
  startNewConversation: () => void;
  removeMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 'welcome',
          type: 'assistant',
          content: '¡Hola! Soy tu asistente de documentos. Sube archivos y hazme cualquier pregunta sobre su contenido. Puedo ayudarte a encontrar información específica, resumir contenido y responder preguntas basadas en tus documentos.',
          timestamp: new Date(),
        },
      ],
      isLoading: false,
      selectedDocuments: [],
      conversationId: null,

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage]
        }));
      },

      sendQuery: async (query: string) => {
        const { selectedDocuments, addMessage, conversationId } = get();

        if (selectedDocuments.length === 0) {
          addMessage({
            type: 'assistant',
            content: 'Por favor, selecciona al menos un documento antes de hacer una pregunta.',
            isError: true,
          });
          return;
        }

        if (!query.trim()) {
          return;
        }

        addMessage({ type: 'user', content: query });
        set({ isLoading: true });

        try {
          console.log('Sending query to backend:', { query, selectedDocuments });

          const result = await chatQueryCall({
            query: query.trim(),
            documentIds: selectedDocuments,
            conversationId: conversationId || undefined,
          });

          console.log('Query result:', result);

          const response = result.data as {
            response: string;
            sources: Array<{
              documentId: string;
              chunkIndex: number;
              score: number;
              text?: string;
            }>;
            chatId: string;
          };

          addMessage({
            type: 'assistant',
            content: response.response,
            sources: response.sources,
          });

          if (!conversationId) {
            set({ conversationId: response.chatId });
          }
        } catch (error) {
          console.error('Error sending query:', error);
          addMessage({
            type: 'assistant',
            content: 'Lo siento, hubo un error procesando tu pregunta. Por favor, intenta de nuevo.',
            isError: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      setSelectedDocuments: (docs) => {
        console.log('Setting selected documents:', docs);
        set({ selectedDocuments: docs });
      },

      clearMessages: () => {
        set({
          messages: [
            {
              id: 'welcome',
              type: 'assistant',
              content: '¡Hola! Soy tu asistente de documentos. Sube archivos y hazme cualquier pregunta sobre su contenido.',
              timestamp: new Date(),
            },
          ],
        });
      },

      startNewConversation: () => {
        set({
          conversationId: null,
          messages: [
            {
              id: 'welcome',
              type: 'assistant',
              content: '¡Nueva conversación iniciada! ¿En qué puedo ayudarte hoy?',
              timestamp: new Date(),
            },
          ],
        });
      },

      removeMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== messageId),
        }));
      },
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        messages: state.messages,
        conversationId: state.conversationId,
      }),
    }
  )
);