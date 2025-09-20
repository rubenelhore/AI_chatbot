import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocuments } from '../../hooks/useDocuments';
import { isValidFileType } from '../../services/documentProcessor';

export const DocumentUpload: React.FC = () => {
  const { uploadDocument, isUploading, uploadError } = useDocuments();

  const onDrop = async (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);

    for (const file of acceptedFiles) {
      if (!isValidFileType(file)) {
        console.error('Invalid file type:', file.type);
        continue;
      }

      if (file.size > 10485760) { // 10MB
        console.error('File too large:', file.size);
        continue;
      }

      try {
        await uploadDocument(file);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10485760, // 10MB
    multiple: true,
    onDrop,
    disabled: isUploading
  });

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="color-card upload-card" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="upload-title">
            Subir Documentos
          </h2>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
            transition-all duration-300 flex-1 flex flex-col items-center justify-center
            hover-lift interactive
            ${isDragActive
              ? 'border-blue-400 bg-blue-50 scale-102'
              : isUploading
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50/50'
            }
          `}
        >
          <input {...getInputProps()} />

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-tl from-cyan-400 to-blue-400 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-semibold text-lg">Subiendo y procesando documento...</p>
                  <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos momentos</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className={`
                  relative p-4 rounded-2xl transition-all duration-300
                  ${isDragActive
                    ? 'bg-blue-100 shadow-lg scale-110'
                    : 'bg-gray-100 hover:bg-blue-50'
                  }
                `}>
                  <Upload className={`
                    w-12 h-12 transition-colors duration-300
                    ${isDragActive ? 'text-blue-600' : 'text-gray-500'}
                  `} />
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-semibold text-lg">
                    {isDragActive
                      ? 'Suelta los archivos aquí...'
                      : 'Arrastra archivos aquí o haz click'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF, DOCX, TXT (máx. 10MB cada uno)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {(uploadError || fileRejections.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-800">Error al subir archivo</h4>
                {uploadError && (
                  <p className="text-sm text-red-700 mt-1">
                    {uploadError instanceof Error ? uploadError.message : 'Error desconocido'}
                  </p>
                )}
                {fileRejections.map((rejection, index) => (
                  <div key={index} className="text-sm text-red-700 mt-2">
                    <strong className="font-medium">{rejection.file.name}</strong>:
                    <ul className="list-disc list-inside ml-3 mt-1 space-y-1">
                      {rejection.errors.map((error, errorIndex) => (
                        <li key={errorIndex}>
                          {error.code === 'file-too-large' && 'Archivo muy grande (máx. 10MB)'}
                          {error.code === 'file-invalid-type' && 'Tipo de archivo no válido'}
                          {error.code !== 'file-too-large' && error.code !== 'file-invalid-type' && error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};