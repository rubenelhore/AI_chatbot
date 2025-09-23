import React from 'react'
import { MessageSquare, Sparkles, Brain, Zap, Settings, User, LogOut } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <header>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px', position: 'relative'}}>
        {/* Lado izquierdo - Status badges */}
        <div className="hidden lg:flex items-center">
          <div className="header-status-container">
            <div className="status-badge status-ready">
              <div className="pulse-dot"></div>
              <span>Sistema Activo</span>
            </div>

            <div className="status-badge status-processing">
              <Zap style={{width: '16px', height: '16px'}} />
              <span>Powered by AI</span>
              <Sparkles style={{width: '16px', height: '16px', animation: 'statusPulse 1.5s infinite'}} />
            </div>
          </div>
        </div>

        {/* Centro - Logo y título */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div className="logo-circle" style={{width: '36px', height: '36px'}}>
            <Brain style={{width: '20px', height: '20px', color: 'white'}} />
          </div>

          <div style={{textAlign: 'left'}}>
            <h1 className="main-title" style={{fontSize: '18px', marginBottom: '2px'}}>
              AI Document Chat
            </h1>
            <p className="subtitle" style={{fontSize: '12px'}}>
              Chatea con tus documentos usando IA avanzada
            </p>
          </div>
        </div>

        {/* Lado derecho - Controles de usuario */}
        <div className="flex items-center space-x-3" style={{marginLeft: 'auto', position: 'relative', zIndex: 10}}>
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(226, 232, 240, 0.5)',
              marginRight: '8px'
            }}>
              <User style={{width: '16px', height: '16px', color: '#667eea'}} />
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#4b5563'
              }}>
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </div>
          )}
          {user && (
            <button
              onClick={logout}
              className="color-button"
              title="Cerrar sesión"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#dc2626'
              }}
            >
              <LogOut style={{width: '16px', height: '16px'}} />
            </button>
          )}
        </div>
      </div>

      {/* Línea de gradiente en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
    </header>
  )
}