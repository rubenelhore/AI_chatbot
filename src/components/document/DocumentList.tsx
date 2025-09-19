import React from 'react'
import { DocumentPreview } from './DocumentPreview'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface Document {
  id: string
  name: string
  type: string
  size: number
  content?: string
  thumbnail?: string
  uploadedAt: Date
}

interface DocumentListProps {
  documents: Document[]
  loading?: boolean
  onRemoveDocument?: (id: string) => void
  onSelectDocument?: (document: Document) => void
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading = false,
  onRemoveDocument,
  onSelectDocument
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay documentos</h3>
        <p className="text-gray-500">Sube algunos documentos para comenzar a chatear con ellos.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Documentos ({documents.length})
        </h3>
      </div>
      
      <div className="grid gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className={`cursor-pointer transition-transform hover:scale-105 ${
              onSelectDocument ? 'hover:shadow-lg' : ''
            }`}
            onClick={() => onSelectDocument?.(document)}
          >
            <DocumentPreview
              id={document.id}
              name={document.name}
              type={document.type}
              size={document.size}
              content={document.content}
              thumbnail={document.thumbnail}
              onRemove={onRemoveDocument}
            />
          </div>
        ))}
      </div>
    </div>
  )
}