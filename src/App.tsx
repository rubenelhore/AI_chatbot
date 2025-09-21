import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/layout/Header'
import { DocumentUpload } from './components/document/DocumentUpload'
import { DocumentList } from './components/document/DocumentList'
import { ChatContainer } from './components/chat/ChatContainer'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'
import { FileText, MessageCircle } from 'lucide-react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

type ViewType = 'documents' | 'chat';

function App() {
  const [activeView, setActiveView] = useState<ViewType>('documents');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div style={{ height: '100vh', position: 'relative', overflow: 'hidden', paddingBottom: '80px' }}>
          {/* Fondo decorativo con círculos de colores */}
          <div style={{
            position: 'absolute',
            inset: '0',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}>
            <div style={{
              position: 'absolute',
              top: '-160px',
              right: '-160px',
              width: '320px',
              height: '320px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)',
              borderRadius: '50%',
              filter: 'blur(60px)'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-160px',
              left: '-160px',
              width: '384px',
              height: '384px',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              borderRadius: '50%',
              filter: 'blur(60px)'
            }}></div>
          </div>

          <Header />

          <main style={{
            position: 'relative',
            zIndex: 10,
            padding: '24px 24px 0 24px'
          }}>
            {activeView === 'documents' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '400px 1fr',
                gap: '32px',
                height: 'calc(100vh - 154px)',
                minHeight: '576px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <DocumentUpload />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <DocumentList />
                </div>
              </div>
            ) : (
              <div style={{
                height: 'calc(100vh - 154px)',
                minHeight: '576px'
              }}>
                <ChatContainer />
              </div>
            )}
          </main>

          {/* Menú inferior */}
          <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            zIndex: 50,
            boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <button
              onClick={() => setActiveView('documents')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                background: activeView === 'documents'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeView === 'documents' ? 'white' : '#6b7280',
                boxShadow: activeView === 'documents'
                  ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'documents') {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.currentTarget.style.color = '#667eea';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'documents') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              <FileText size={20} />
              Documentos
            </button>

            <button
              onClick={() => setActiveView('chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                background: activeView === 'chat'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeView === 'chat' ? 'white' : '#6b7280',
                boxShadow: activeView === 'chat'
                  ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'chat') {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.currentTarget.style.color = '#667eea';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'chat') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              <MessageCircle size={20} />
              Chat
            </button>
          </div>
        </div>
        <ToastProvider />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App