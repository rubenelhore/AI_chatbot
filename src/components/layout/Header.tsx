import React from 'react'
import { MessageSquare, Sparkles, Brain, Zap, Settings, User } from 'lucide-react'
import { Button } from '../ui/Button'

export const Header: React.FC = () => {
  return (
    <header>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', position: 'relative'}}>
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
          <div className="logo-circle">
            <Brain style={{width: '28px', height: '28px', color: 'white'}} />
          </div>

          <div style={{textAlign: 'left'}}>
            <h1 className="main-title">
              AI Document Chat
            </h1>
            <p className="subtitle">
              Chatea con tus documentos usando IA avanzada
            </p>
          </div>
        </div>

        {/* Lado derecho - Controles de usuario */}
        <div className="flex items-center space-x-3" style={{marginLeft: 'auto', position: 'relative', zIndex: 10}}>
          <button className="color-button">
            <Settings style={{width: '16px', height: '16px'}} />
          </button>
          <button className="color-button">
            <User style={{width: '16px', height: '16px'}} />
          </button>
        </div>
      </div>

      {/* Línea de gradiente en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
    </header>
  )
}