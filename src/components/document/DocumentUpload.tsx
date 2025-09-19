import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface DocumentUploadProps {
  onUpload: (files: File[]) => void
  loading?: boolean
  accept?: string[]
  maxFiles?: number
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  loading = false,
  accept = ['.pdf', '.doc', '.docx', '.txt'],
  maxFiles = 10
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles,
    disabled: loading
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">Procesando documentos...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Suelta los archivos aquí...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">
                  Arrastra archivos aquí o{' '}
                  <span className="text-blue-600 font-medium">selecciona archivos</span>
                </p>
                <p className="text-sm text-gray-500">
                  Formatos soportados: {accept.join(', ')}
                </p>
              </div>
            )}
            
            <Button variant="outline" disabled={loading}>
              Seleccionar archivos
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}