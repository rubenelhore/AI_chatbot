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
    <div className="border-t border-gray-200 bg-white rounded-b-xl">
      {/* Suggestions */}
      {hasSelectedDocuments && !isLoading && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 self-center mr-2">Sugerencias:</span>
            {[
              "Resume los puntos principales",
              "¿Cuáles son las conclusiones?",
              "Explica este concepto",
              "¿Qué dice sobre...?"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              disabled={isLoading || !hasSelectedDocuments}
              rows={1}
              className="
                w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                transition-all duration-200
              "
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />

            {/* Voice Input Button */}
            {'webkitSpeechRecognition' in window && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading || !hasSelectedDocuments}
                className="
                  absolute right-3 top-1/2 transform -translate-y-1/2
                  p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50
                  transition-colors
                "
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Clear Chat Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              disabled={isLoading}
              className="p-2"
              title="Limpiar chat"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={!canSend}
              isLoading={isLoading}
              className="px-4 py-3 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Status Messages */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {hasSelectedDocuments && (
              <span>
                {selectedDocuments.length} documento{selectedDocuments.length !== 1 ? 's' : ''} seleccionado{selectedDocuments.length !== 1 ? 's' : ''}
              </span>
            )}
            {isListening && (
              <motion.span
                className="text-red-500 font-medium"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎤 Escuchando...
              </motion.span>
            )}
          </div>
          <div className="text-right">
            <span>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
          </div>
        </div>
      </div>
    </div>
  );
};