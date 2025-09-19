import React from 'react'
import { Button } from '../ui/Button'

interface HeaderProps {
  title?: string
  subtitle?: string
  onNewChat?: () => void
  chatCount?: number
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Document Chatbot',
  subtitle = 'Chatea con tus documentos usando IA',
  onNewChat,
  chatCount = 0
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {chatCount > 0 && (
            <div className="text-sm text-gray-500">
              {chatCount} conversación{chatCount !== 1 ? 'es' : ''}
            </div>
          )}
          
          {onNewChat && (
            <Button onClick={onNewChat} size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva conversación
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}