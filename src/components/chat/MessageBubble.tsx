import React from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface MessageBubbleProps {
  content: string
  role: 'user' | 'assistant'
  isLoading?: boolean
  avatar?: string
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  role,
  isLoading = false,
  avatar
}) => {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
          isUser ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-full h-full rounded-full" />
          ) : (
            <span>{isUser ? 'U' : 'AI'}</span>
          )}
        </div>
      </div>

      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`
            inline-block px-4 py-2 rounded-lg max-w-[85%]
            ${isUser
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-900 border border-gray-200'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" color={isUser ? 'white' : 'gray'} />
              <span>Escribiendo...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{content}</div>
          )}
        </div>
      </div>
    </div>
  )
}