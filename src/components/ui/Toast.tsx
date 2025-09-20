import React from 'react';
import toast, { Toaster, Toast as ToastType } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Custom toast component
const CustomToast: React.FC<{ t: ToastType }> = ({ t }) => {
  const getIcon = () => {
    switch (t.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (t.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`
            max-w-md w-full ${getBackgroundColor()} border rounded-lg shadow-lg p-4
            flex items-center space-x-3
          `}
        >
          {getIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {t.message as string}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast provider component
export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          margin: 0
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
      }}
    >
      {(t) => <CustomToast t={t} />}
    </Toaster>
  );
};

// Toast utility functions
export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  info: (message: string) => {
    toast(message, {
      icon: <Info className="w-5 h-5 text-blue-500" />,
    });
  },

  warning: (message: string) => {
    toast(message, {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      style: {
        background: '#fef3c7',
        border: '1px solid #fbbf24',
      },
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading = 'Cargando...',
      success = 'Completado',
      error = 'Error'
    }: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  custom: (jsx: React.ReactNode, options?: any) => {
    return toast.custom((t) => jsx as React.ReactElement, options);
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  remove: (toastId?: string) => {
    toast.remove(toastId);
  }
};

// Pre-built toast messages for common scenarios
export const toastMessages = {
  documentUpload: {
    loading: 'Subiendo documento...',
    success: 'Documento subido exitosamente',
    error: 'Error al subir el documento'
  },

  documentProcess: {
    loading: 'Procesando documento...',
    success: 'Documento procesado y listo para usar',
    error: 'Error al procesar el documento'
  },

  chatQuery: {
    loading: 'Generando respuesta...',
    success: 'Respuesta generada',
    error: 'Error al generar la respuesta'
  },

  documentDelete: {
    loading: 'Eliminando documento...',
    success: 'Documento eliminado',
    error: 'Error al eliminar el documento'
  },

  copy: {
    success: 'Copiado al portapapeles',
    error: 'Error al copiar'
  },

  fileValidation: {
    invalidType: 'Tipo de archivo no válido. Solo se permiten PDF, DOCX y TXT.',
    tooLarge: 'El archivo es muy grande. Máximo 10MB.',
    tooMany: 'Demasiados archivos. Máximo 5 archivos a la vez.'
  },

  network: {
    offline: 'Sin conexión a internet',
    reconnected: 'Conexión restablecida',
    error: 'Error de conexión'
  }
};

export default showToast;