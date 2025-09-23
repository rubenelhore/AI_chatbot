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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        padding: '48px 32px'
      }}
    >
      {readyDocuments.length === 0 ? (
        <>
          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              opacity: 0.3
            }}></div>
            <div style={{
              position: 'relative',
              width: '96px',
              height: '96px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
            }}>
              <MessageSquare style={{ width: '48px', height: '48px', color: 'white' }} />
            </div>
          </div>
          <h3 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1e40af 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            ¡Bienvenido al Chat de Documentos!
          </h3>
          <p style={{
            color: '#6b7280',
            marginBottom: '32px',
            maxWidth: '512px',
            fontSize: '18px',
            lineHeight: '1.7',
            fontWeight: '500'
          }}>
            Sube algunos documentos en el panel izquierdo para empezar a hacer preguntas inteligentes sobre su contenido usando IA avanzada.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.8) 100%)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '448px'
            }}
          >
            <h4 style={{
              fontWeight: '700',
              color: '#1e40af',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Sparkles style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              ¿Qué puedes hacer?
            </h4>
            <ul style={{
              fontSize: '14px',
              color: '#1d4ed8',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'left'
            }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  marginTop: '8px',
                  flexShrink: 0
                }}></span>
                <span>Hacer preguntas específicas sobre el contenido</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  marginTop: '8px',
                  flexShrink: 0
                }}></span>
                <span>Obtener resúmenes y puntos clave</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  marginTop: '8px',
                  flexShrink: 0
                }}></span>
                <span>Comparar información entre documentos</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  marginTop: '8px',
                  flexShrink: 0
                }}></span>
                <span>Encontrar información relevante rápidamente</span>
              </li>
            </ul>
          </motion.div>
        </>
      ) : (
        <>
          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              opacity: 0.3
            }}></div>
            <div style={{
              position: 'relative',
              width: '96px',
              height: '96px',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
            }}>
              <Sparkles style={{ width: '48px', height: '48px', color: 'white' }} />
            </div>
          </div>
          <h3 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #059669 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            ¡Documentos listos!
          </h3>
          <p style={{
            color: '#6b7280',
            marginBottom: '32px',
            maxWidth: '512px',
            fontSize: '18px',
            lineHeight: '1.7',
            fontWeight: '500'
          }}>
            Tus documentos han sido procesados y están listos. Selecciona uno o varios documentos arriba y comienza a hacer preguntas.
          </p>
        </>
      )}
    </motion.div>
  );

  return (
    <motion.div
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 40px rgba(59, 130, 246, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden'
      }}>
        {/* Header con efecto glassmorphism */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          borderBottom: '2px solid',
          borderImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6) 1',
          paddingBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: '-3px',
                background: 'linear-gradient(135deg, #a78bfa 0%, #f9a8d4 100%)',
                borderRadius: '15px',
                filter: 'blur(6px)',
                opacity: 0.4
              }}></div>
              <div style={{ position: 'relative' }}>
                <MessageSquare style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #1e40af 0%, #6366f1 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                marginBottom: '4px'
              }}>
                Chat con Documentos
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
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
            <div style={{
              background: 'linear-gradient(135deg, #fce7f3 0%, #ddd6fe 100%)',
              padding: '8px 20px',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: '700',
              color: '#7c3aed',
              border: '2px solid rgba(124, 58, 237, 0.2)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)'
            }}>
              {messages.length - 1} mensaje{messages.length !== 2 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Document Selection con chips elegantes */}
        {readyDocuments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
              padding: '24px',
              marginBottom: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#3b82f6',
                borderRadius: '50%',
                marginRight: '12px'
              }}></span>
              Documentos disponibles
              <span style={{
                marginLeft: '12px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                color: '#1e40af',
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                {readyDocuments.length}
              </span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {readyDocuments.map((doc, index) => (
                <motion.button
                  key={doc.id}
                  onClick={() => handleDocumentToggle(doc.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: 'relative',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    backdropFilter: 'blur(8px)',
                    cursor: 'pointer',
                    background: selectedDocuments.includes(doc.id)
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.6)',
                    color: selectedDocuments.includes(doc.id) ? 'white' : '#374151',
                    borderColor: selectedDocuments.includes(doc.id) ? '#667eea' : 'rgba(229, 231, 235, 0.8)',
                    boxShadow: selectedDocuments.includes(doc.id)
                      ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                      : '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedDocuments.includes(doc.id)) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.borderColor = 'rgba(147, 197, 253, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedDocuments.includes(doc.id)) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                      e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.8)';
                    }
                  }}
                >
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {/* Indicador de selección */}
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: selectedDocuments.includes(doc.id)
                        ? '#10b981'
                        : 'transparent',
                      border: selectedDocuments.includes(doc.id)
                        ? '2px solid #10b981'
                        : '2px solid rgba(156, 163, 175, 0.5)',
                      flexShrink: 0
                    }}></div>

                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '160px'
                    }}>
                      {doc.name.length > 30 ? `${doc.name.substring(0, 30)}...` : doc.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages con fondo elegante */}
        <div style={{
          flex: 1,
          overflow: 'visible',
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(245, 247, 255, 0.4) 0%, rgba(239, 246, 255, 0.3) 50%, rgba(243, 244, 246, 0.3) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(99, 102, 241, 0.06)',
          backdropFilter: 'blur(8px)'
        }}>
          {/* Fondo sutil con pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            pointerEvents: 'none'
          }}>
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '128px',
              height: '128px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%)',
              borderRadius: '50%',
              filter: 'blur(60px)'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              width: '96px',
              height: '96px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }}></div>
          </div>

          {messages.length <= 1 ? (
            <EmptyState />
          ) : (
            <div style={{
              position: 'relative',
              zIndex: 10,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
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
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #6b7280 0%, #3b82f6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}>
                      <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      borderBottomLeftRadius: '4px',
                      padding: '16px 24px',
                      border: '1px solid rgba(229, 231, 235, 0.5)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
                    }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.div
                          style={{
                            width: '10px',
                            height: '10px',
                            background: '#3b82f6',
                            borderRadius: '50%'
                          }}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          style={{
                            width: '10px',
                            height: '10px',
                            background: '#3b82f6',
                            borderRadius: '50%'
                          }}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div
                          style={{
                            width: '10px',
                            height: '10px',
                            background: '#3b82f6',
                            borderRadius: '50%'
                          }}
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
        <div style={{
          background: 'rgba(248, 250, 252, 0.9)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(199, 210, 254, 0.3)',
          borderRadius: '16px',
          border: '1px solid rgba(99, 102, 241, 0.08)',
          marginTop: '24px'
        }}>
          <ChatInput />
        </div>
      </div>
    </motion.div>
  );
};