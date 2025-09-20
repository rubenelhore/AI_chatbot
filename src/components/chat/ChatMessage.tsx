import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, FileText, ExternalLink, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../../stores/chatStore';
import { useDocuments } from '../../hooks/useDocuments';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const isUser = message.type === 'user';
  const { getReadyDocuments } = useDocuments();
  const readyDocuments = getReadyDocuments();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center shadow-sm
            ${isUser ? 'bg-blue-600' : 'bg-gray-600'}
          `}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex flex-col max-w-full">
          <div className={`
            rounded-2xl px-4 py-3 relative
            ${isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : message.isError
                ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }
          `}>
            {/* Copy Button */}
            {!isUser && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                title="Copiar mensaje"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-500" />
                )}
              </button>
            )}

            {/* Message Text */}
            <div className="pr-8">
              {isUser ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              ) : (
                <div className="prose prose-sm max-w-none prose-gray">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="mb-2 last:mb-0 ml-4 list-disc">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-2 last:mb-0 ml-4 list-decimal">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children }) => (
                        <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-200 p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <FileText className="w-3 h-3 mr-1 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">
                    Fuentes consultadas ({message.sources.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {message.sources.slice(0, 3).map((source, index) => {
                    const document = readyDocuments.find(doc => doc.id === source.documentId);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <FileText className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-700 truncate">
                              {document?.name || 'Documento desconocido'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Fragmento {source.chunkIndex + 1} • {Math.round(source.score * 100)}% relevancia
                            </p>
                          </div>
                        </div>
                        {document?.url && (
                          <button
                            onClick={() => window.open(document.url, '_blank')}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Ver documento"
                          >
                            <ExternalLink className="w-3 h-3 text-gray-500" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {message.sources.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{message.sources.length - 3} fuentes más
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <p className={`
            text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity
            ${isUser ? 'text-right' : 'text-left'}
          `}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </motion.div>
  );
});