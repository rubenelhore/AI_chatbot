import React, { useRef, useEffect } from 'react';
import { AlertTriangle, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../stores/chatStore';
import { useDocuments } from '../../hooks/useDocuments';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export const ChatContainer: React.FC = () => {
  const {
    messages,
    isLoading,
    selectedDocuments,
    setSelectedDocuments
  } = useChatStore();

  const { getReadyDocuments } = useDocuments();
  const readyDocuments = getReadyDocuments();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (readyDocuments.length > 0 && selectedDocuments.length === 0) {
      setSelectedDocuments([readyDocuments[0].id]);
    }
  }, [readyDocuments, selectedDocuments, setSelectedDocuments]);

  const handleDocumentToggle = (documentId: string) => {
    const newSelection = selectedDocuments.includes(documentId)
      ? selectedDocuments.filter(id => id !== documentId)
      : [...selectedDocuments, documentId];

    setSelectedDocuments(newSelection);
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center px-8 py-12"
    >
      {readyDocuments.length === 0 ? (
        <>
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 text-shadow">
            ¡Bienvenido al Chat de Documentos!
          </h3>
          <p className="text-gray-600 mb-8 max-w-lg text-lg leading-relaxed">
            Sube algunos documentos en el panel izquierdo para empezar a hacer preguntas inteligentes sobre su contenido usando IA avanzada.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 max-w-md"
          >
            <h4 className="font-bold text-blue-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              ¿Qué puedes hacer?
            </h4>
            <ul className="text-sm text-blue-700 space-y-3 text-left">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Hacer preguntas específicas sobre el contenido</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Obtener resúmenes y puntos clave</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Comparar información entre documentos</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Encontrar información relevante rápidamente</span>
              </li>
            </ul>
          </motion.div>
        </>
      ) : (
        <>
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 text-shadow">
            ¡Documentos listos!
          </h3>
          <p className="text-gray-600 mb-8 max-w-lg text-lg leading-relaxed">
            Tus documentos han sido procesados y están listos. Selecciona uno o varios documentos arriba y comienza a hacer preguntas.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-50/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 max-w-md"
          >
            <h4 className="font-bold text-purple-800 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Ejemplos de preguntas
            </h4>
            <ul className="text-sm text-purple-700 space-y-3 text-left">
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>"¿Cuáles son los puntos principales?"</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>"Resume este documento en 3 párrafos"</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>"¿Qué dice sobre [tema específico]?"</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>"Compara las conclusiones entre documentos"</span>
              </li>
            </ul>
          </motion.div>
        </>
      )}
    </motion.div>
  );

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="color-card chat-container flex flex-col h-full overflow-hidden">
        {/* Header con efecto glassmorphism */}
        <div className="chat-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 text-shadow">
                  Chat con Documentos
                </h2>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {selectedDocuments.length > 0
                    ? `${selectedDocuments.length} documento${selectedDocuments.length !== 1 ? 's' : ''} seleccionado${selectedDocuments.length !== 1 ? 's' : ''}`
                    : readyDocuments.length > 0
                      ? 'Selecciona documentos para empezar'
                      : 'Sube documentos para empezar'
                  }
                </p>
              </div>
            </div>
            {messages.length > 1 && (
              <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {messages.length - 1} mensaje{messages.length !== 2 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Document Selection con chips elegantes */}
        {readyDocuments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6"
          >
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Documentos disponibles
              <span className="ml-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {readyDocuments.length}
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {readyDocuments.map((doc, index) => (
                <motion.button
                  key={doc.id}
                  onClick={() => handleDocumentToggle(doc.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative group px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                    border backdrop-blur-sm hover-lift
                    ${selectedDocuments.includes(doc.id)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400 shadow-lg'
                      : 'bg-white/60 text-gray-700 border-gray-200 hover:bg-white/80 hover:border-blue-200'
                    }
                  `}
                >
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center space-x-2">
                    <span className="truncate max-w-32">
                      {doc.name.length > 25 ? `${doc.name.substring(0, 25)}...` : doc.name}
                    </span>
                    {doc.chunkCount && (
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-bold backdrop-blur-sm
                        ${selectedDocuments.includes(doc.id)
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 text-blue-700'
                        }
                      `}>
                        {doc.chunkCount}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages con fondo elegante */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Fondo sutil con pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-tl from-blue-400 to-purple-400 rounded-full blur-2xl"></div>
          </div>

          {messages.length <= 1 ? (
            <EmptyState />
          ) : (
            <div className="relative z-10 p-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {messages.slice(1).map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ChatMessage message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-gray-600 to-blue-600 flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-bl-md px-6 py-4 border border-gray-200 shadow-lg">
                      <div className="flex space-x-2">
                        <motion.div
                          className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div
                          className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input con estilo moderno */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
          <ChatInput />
        </div>
      </div>
    </motion.div>
  );
};