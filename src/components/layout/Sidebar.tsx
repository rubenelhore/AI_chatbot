import React from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  documentCount?: number
  onUploadClick?: () => void
  onDocumentsClick?: () => void
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  documentCount = 0,
  onUploadClick,
  onDocumentsClick,
  className = ''
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        w-80
        ${className}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          <Card title="Acciones rápidas">
            <div className="space-y-2">
              <Button 
                onClick={onUploadClick}
                className="w-full justify-start"
                variant="outline"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Subir documentos
              </Button>
              
              <Button 
                onClick={onDocumentsClick}
                className="w-full justify-start"
                variant="outline"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver documentos ({documentCount})
              </Button>
            </div>
          </Card>
          
          {/* Stats */}
          <Card title="Estadísticas">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Documentos:</span>
                <span className="font-medium">{documentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estado:</span>
                <span className={`text-sm font-medium ${
                  documentCount > 0 ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {documentCount > 0 ? 'Listo para chatear' : 'Sin documentos'}
                </span>
              </div>
            </div>
          </Card>
          
          {/* Help */}
          <Card title="Ayuda">
            <div className="text-sm text-gray-600 space-y-2">
              <p>1. Sube tus documentos (PDF, Word, TXT)</p>
              <p>2. Espera a que se procesen</p>
              <p>3. ¡Comienza a chatear!</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}