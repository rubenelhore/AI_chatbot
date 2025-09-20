import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/layout/Header'
import { DocumentUpload } from './components/document/DocumentUpload'
import { DocumentList } from './components/document/DocumentList'
import { ChatContainer } from './components/chat/ChatContainer'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'

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

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen relative overflow-hidden">
          {/* Fondo decorativo con círculos de colores */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          </div>

          <Header />

          <main className="main-container relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-160px)] min-h-[600px]">
              {/* Sidebar con documentos */}
              <div className="xl:col-span-4 2xl:col-span-3">
                <div className="flex flex-col h-full space-y-6">
                  <div className="flex-1 min-h-0">
                    <DocumentUpload />
                  </div>
                  <div className="flex-1 min-h-0">
                    <DocumentList />
                  </div>
                </div>
              </div>

              {/* Área principal de chat */}
              <div className="xl:col-span-8 2xl:col-span-9">
                <ChatContainer />
              </div>
            </div>
          </main>
        </div>
        <ToastProvider />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App