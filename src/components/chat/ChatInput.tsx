import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChatStore } from '../../stores/chatStore';
import { useDocuments } from '../../hooks/useDocuments';
import { Button } from '../ui/Button';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    sendQuery,
    isLoading,
    selectedDocuments,
    clearMessages,
    startNewConversation
  } = useChatStore();

  const { getReadyDocuments } = useDocuments();
  const readyDocuments = getReadyDocuments();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Focus on input when documents are selected
  useEffect(() => {
    if (selectedDocuments.length > 0 && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedDocuments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || selectedDocuments.length === 0) return;

    const query = input.trim();
    setInput('');

    await sendQuery(query);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Speech recognition (experimental)
  const toggleListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';

      if (!isListening) {
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    }
  };

  const canSend = input.trim() && !isLoading && selectedDocuments.length > 0;
  const hasDocuments = readyDocuments.length > 0;
  const hasSelectedDocuments = selectedDocuments.length > 0;

  const getPlaceholder = () => {
    if (!hasDocuments) return "Sube documentos para empezar...";
    if (!hasSelectedDocuments) return "Selecciona documentos para hacer preguntas...";
    return "Pregunta algo sobre tus documentos...";
  };

  return (
    <div style={{
      borderTop: '1px solid rgba(229, 231, 235, 0.5)',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Suggestions */}
      {hasSelectedDocuments && !isLoading && (
        <div style={{
          padding: '16px 24px 12px 24px',
          borderBottom: '1px solid rgba(243, 244, 246, 0.8)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              alignSelf: 'center',
              marginRight: '8px',
              fontWeight: '500'
            }}>Sugerencias:</span>
            {[
              "Resume los puntos principales",
              "¿Cuáles son las conclusiones?",
              "Explica este concepto",
              "¿Qué dice sobre...?"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.8) 100%)',
                  color: '#4b5563',
                  borderRadius: '100px',
                  border: '1px solid rgba(209, 213, 219, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.8) 100%)';
                  e.currentTarget.style.color = '#1e40af';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(243, 244, 246, 0.8) 0%, rgba(229, 231, 235, 0.8) 100%)';
                  e.currentTarget.style.color = '#4b5563';
                  e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 0.5)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding: '20px 24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          {/* Text Input */}
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              disabled={isLoading || !hasSelectedDocuments}
              rows={1}
              style={{
                width: '100%',
                padding: '16px 48px 16px 16px',
                border: '1px solid rgba(209, 213, 219, 0.6)',
                borderRadius: '12px',
                resize: 'none',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
                transition: 'all 0.2s ease',
                minHeight: '48px',
                maxHeight: '120px',
                color: isLoading || !hasSelectedDocuments ? '#9ca3af' : '#1f2937',
                cursor: isLoading || !hasSelectedDocuments ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => {
                if (!isLoading && hasSelectedDocuments) {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 0.6)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {/* Voice Input Button */}
            {'webkitSpeechRecognition' in window && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading || !hasSelectedDocuments}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  marginTop: '-22px',
                  padding: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: isLoading || !hasSelectedDocuments ? 'not-allowed' : 'pointer',
                  color: isListening ? '#ef4444' : '#9ca3af',
                  opacity: isLoading || !hasSelectedDocuments ? 0.5 : 1,
                  transition: 'color 0.2s ease, background 0.2s ease',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && hasSelectedDocuments) {
                    e.currentTarget.style.color = isListening ? '#dc2626' : '#6b7280';
                    e.currentTarget.style.background = 'rgba(243, 244, 246, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isListening ? '#ef4444' : '#9ca3af';
                  e.currentTarget.style.background = 'none';
                }}
              >
                {isListening ? (
                  <MicOff style={{ width: '16px', height: '16px' }} />
                ) : (
                  <Mic style={{ width: '16px', height: '16px' }} />
                )}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Clear Chat Button */}
            <button
              type="button"
              onClick={clearMessages}
              disabled={isLoading}
              title="Limpiar chat"
              style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(209, 213, 219, 0.5)',
                borderRadius: '12px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                color: '#6b7280',
                transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                backdropFilter: 'blur(8px)',
                opacity: isLoading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(243, 244, 246, 0.9)';
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 0.5)';
              }}
            >
              <RotateCcw style={{ width: '16px', height: '16px' }} />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!canSend}
              style={{
                padding: '12px 16px',
                background: canSend
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(156, 163, 175, 0.5)',
                border: 'none',
                borderRadius: '12px',
                cursor: canSend ? 'pointer' : 'not-allowed',
                color: 'white',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
                boxShadow: canSend ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '48px'
              }}
              onMouseEnter={(e) => {
                if (canSend) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (canSend) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <Send style={{ width: '16px', height: '16px' }} />
              )}
            </button>
          </div>
        </form>

        {/* Status Messages */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {hasSelectedDocuments && (
              <span style={{ fontWeight: '500' }}>
                {selectedDocuments.length} documento{selectedDocuments.length !== 1 ? 's' : ''} seleccionado{selectedDocuments.length !== 1 ? 's' : ''}
              </span>
            )}
            {isListening && (
              <motion.span
                style={{
                  color: '#ef4444',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎤 Escuchando...
              </motion.span>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontWeight: '400' }}>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
          </div>
        </div>
      </div>
    </div>
  );
};