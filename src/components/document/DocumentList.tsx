import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  File,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useDocuments, Document } from '../../hooks/useDocuments';
import { formatFileSize } from '../../services/documentProcessor';

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
}

const DocumentItem: React.FC<DocumentItemProps> = React.memo(({ document }) => {
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
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
        padding: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        height: '140px',
        minHeight: '140px',
        maxHeight: '140px',
        width: '100%',
        minWidth: '0',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12), 0 0 40px rgba(59, 130, 246, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(147, 197, 253, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* Línea superior decorativa */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 25%, #ef4444 50%, #f59e0b 75%, #10b981 100%)',
        opacity: 0.8
      }}></div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '12px', flex: 1 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute',
              inset: '-3px',
              background: 'linear-gradient(135deg, #a78bfa 0%, #f9a8d4 100%)',
              borderRadius: '12px',
              filter: 'blur(6px)',
              opacity: 0.4
            }}></div>
            <div style={{
              position: 'relative',
              padding: '8px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(3deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
            >
              {getFileIcon(document.type)}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              marginBottom: '2px',
              lineHeight: '1.2'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #3b82f6 100%)';
              e.currentTarget.style.WebkitBackgroundClip = 'text';
              e.currentTarget.style.WebkitTextFillColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)';
              e.currentTarget.style.WebkitBackgroundClip = 'text';
              e.currentTarget.style.WebkitTextFillColor = 'transparent';
            }}
            >
              {document.name}
            </h3>

            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '100px',
                fontSize: '10px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                color: '#374151',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}>
                💾 {formatFileSize(document.size)}
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '100px',
                fontSize: '10px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                color: '#1e40af',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 1px 2px rgba(59, 130, 246, 0.1)'
              }}>
                🕐 {formatDate(document.uploadedAt)}
              </span>
              {document.chunkCount && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '100px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                  color: '#6b21a8',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  boxShadow: '0 1px 2px rgba(147, 51, 234, 0.1)'
                }}>
                  📦 {document.chunkCount} chunks
                </span>
              )}
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

      </div>
    </motion.div>
  );
});

export const DocumentList: React.FC = () => {
  const {
    documents,
    isLoading,
    totalDocuments
  } = useDocuments();

  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 1200);

  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 40px rgba(59, 130, 246, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        borderBottom: '2px solid',
        borderImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6) 1',
        paddingBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #1e40af 0%, #6366f1 50%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          marginBottom: '20px',
          overflow: 'visible',
          maxHeight: 'none',
          height: 'auto',
          whiteSpace: 'nowrap',
          textOverflow: 'visible',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          Mis Documentos
        </h2>
        {totalDocuments > 0 && (
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
            {totalDocuments} {totalDocuments === 1 ? 'doc' : 'docs'}
          </div>
        )}
      </div>


      {/* Document List */}
      <div style={{
        flex: 1,
        overflow: 'visible',
        padding: '4px',
        marginTop: '8px'
      }}>
        {documents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              textAlign: 'center',
              paddingTop: '60px',
              paddingBottom: '60px'
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                position: 'absolute',
                inset: '-20px',
                background: 'radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)'
              }}></div>
              <div style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.8)'
              }}>
                <File style={{ width: '48px', height: '48px', color: '#6b7280' }} />
              </div>
            </div>
            <p style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '12px'
            }}>No hay documentos</p>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Sube algunos archivos para empezar a chatear 💬
            </p>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(2, 1fr)',
            gap: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <AnimatePresence mode="popLayout">
              {documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <DocumentItem
                    document={document}
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