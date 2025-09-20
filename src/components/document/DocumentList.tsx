import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  File,
  FileText,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react';
import { useDocuments, Document } from '../../hooks/useDocuments';
import { formatFileSize } from '../../services/documentProcessor';
import { Button } from '../ui/Button';

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return <File className="h-5 w-5 text-red-500" />;
  if (type.includes('word') || type.includes('document')) return <FileText className="h-5 w-5 text-blue-500" />;
  return <FileText className="h-5 w-5 text-gray-500" />;
};

const getStatusIcon = (status: Document['status']) => {
  switch (status) {
    case 'uploading':
    case 'processing':
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'ready':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusText = (status: Document['status']) => {
  switch (status) {
    case 'uploading':
      return 'Subiendo...';
    case 'processing':
      return 'Procesando...';
    case 'ready':
      return 'Listo';
    case 'error':
      return 'Error';
    default:
      return 'Desconocido';
  }
};

const getStatusColor = (status: Document['status']) => {
  switch (status) {
    case 'uploading':
    case 'processing':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'ready':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'error':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

interface DocumentItemProps {
  document: Document;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = React.memo(({ document, onDelete, isDeleting }) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 hover-lift"
    >
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1 p-2 bg-white/80 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
            {getFileIcon(document.type)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
              {document.name}
            </h3>

            <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                {formatFileSize(document.size)}
              </span>
              <span>{formatDate(document.uploadedAt)}</span>
              {document.chunkCount && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {document.chunkCount} chunks
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center space-x-2">
              <div className={`
                inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border
                ${getStatusColor(document.status)}
              `}>
                {getStatusIcon(document.status)}
                <span className="ml-2">{getStatusText(document.status)}</span>
              </div>
            </div>

            {document.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="font-semibold">Error:</strong> {document.error}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {document.url && document.status === 'ready' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(document.url, '_blank')}
              className="p-2 hover-lift bg-white/80 hover:bg-blue-50 border border-gray-200 hover:border-blue-200"
            >
              <Download className="h-4 w-4 text-blue-600" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(document.id)}
            disabled={isDeleting}
            className="p-2 hover-lift bg-white/80 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-red-600 hover:text-red-700"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

export const DocumentList: React.FC = () => {
  const {
    documents,
    isLoading,
    deleteDocument,
    isDeleting,
    totalDocuments,
    readyDocuments,
    processingDocuments,
    errorDocuments
  } = useDocuments();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col p-6 hover-lift"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
            <File className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-shadow">
            Mis Documentos
          </h2>
        </div>
        {totalDocuments > 0 && (
          <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {totalDocuments} {totalDocuments === 1 ? 'doc' : 'docs'}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {totalDocuments > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative text-center p-4 bg-green-50 border border-green-200 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="text-2xl font-bold text-green-700">{readyDocuments}</div>
              <div className="text-xs font-medium text-green-600 mt-1">Listos</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative text-center p-4 bg-blue-50 border border-blue-200 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="text-2xl font-bold text-blue-700">{processingDocuments}</div>
              <div className="text-xs font-medium text-blue-600 mt-1">Procesando</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative text-center p-4 bg-red-50 border border-red-200 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="text-2xl font-bold text-red-700">{errorDocuments}</div>
              <div className="text-xs font-medium text-red-600 mt-1">Errores</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center py-12"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-blue-400/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <File className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-700 font-semibold text-lg">No hay documentos</p>
            <p className="text-sm text-gray-500 mt-2">
              Sube algunos archivos para empezar a chatear
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DocumentItem
                    document={document}
                    onDelete={deleteDocument}
                    isDeleting={isDeleting}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};