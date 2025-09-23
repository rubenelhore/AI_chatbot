import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Eye, EyeOff, Mail, Lock, User, LogIn } from 'lucide-react';
import { getFirebaseErrorMessage } from '../../utils/firebaseErrors';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // Configurar el proveedor de Google
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
        }
      }
      onSuccess();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code) || err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      console.log('Iniciando autenticación con Google...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Autenticación exitosa:', result.user.email);
      onSuccess();
    } catch (err: any) {
      console.error('Error de autenticación con Google:', err);
      console.error('Código de error:', err.code);
      console.error('Mensaje:', err.message);

      // Manejar errores específicos
      if (err.code === 'auth/popup-blocked') {
        setError('El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes para este sitio.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Se canceló el intento de inicio de sesión.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Se cerró la ventana antes de completar el inicio de sesión.');
      } else {
        setError(getFirebaseErrorMessage(err.code) || err.message || 'Error al iniciar sesión con Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setTimeout(() => {
        setShowResetPassword(false);
        setResetEmailSent(false);
      }, 5000);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code) || err.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #e0e7ff 75%, #f3f4f6 100%)',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Círculos decorativos */}
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

      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(24px)',
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.4)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '40px',
        position: 'relative',
        zIndex: 10
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          AI Document Chat
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '32px',
          fontSize: '14px'
        }}>
          {showResetPassword
            ? 'Ingresa tu correo para recuperar tu contraseña'
            : isLogin
              ? 'Inicia sesión para acceder a tus documentos'
              : 'Crea una cuenta para comenzar'
          }
        </p>

        {resetEmailSent && (
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#16a34a',
              fontSize: '14px',
              fontWeight: '600',
              margin: 0
            }}>¡Correo enviado! Revisa tu bandeja de entrada</p>
          </div>
        )}

        <form onSubmit={showResetPassword ? handlePasswordReset : handleSubmit}>
          {!isLogin && !showResetPassword && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4b5563',
                marginBottom: '8px'
              }}>
                Nombre
              </label>
              <div style={{
                position: 'relative'
              }}>
                <User size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    borderRadius: '12px',
                    border: '1px solid rgba(226, 232, 240, 0.5)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#4b5563',
              marginBottom: '8px'
            }}>
              Correo electrónico
            </label>
            <div style={{
              position: 'relative'
            }}>
              <Mail size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  borderRadius: '12px',
                  border: '1px solid rgba(226, 232, 240, 0.5)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {!showResetPassword && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4b5563',
                marginBottom: '8px'
              }}>
                Contraseña
              </label>
            <div style={{
              position: 'relative'
            }}>
              <Lock size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 44px',
                  borderRadius: '12px',
                  border: '1px solid rgba(226, 232, 240, 0.5)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#9ca3af'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {isLogin && (
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(true);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: '8px'
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>
          )}

          {error && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#dc2626',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'box-shadow 0.3s ease, opacity 0.3s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            {loading
              ? 'Procesando...'
              : showResetPassword
                ? 'Enviar correo de recuperación'
                : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')
            }
          </button>
        </form>

        {showResetPassword ? (
          <button
            type="button"
            onClick={() => {
              setShowResetPassword(false);
              setError('');
              setResetEmailSent(false);
            }}
            style={{
              width: '100%',
              marginTop: '16px',
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Volver al inicio de sesión
          </button>
        ) : (
        <>
        <div style={{
          margin: '24px 0',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '1px',
            background: 'rgba(226, 232, 240, 0.5)'
          }}></div>
          <span style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '0 16px',
            position: 'relative',
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            o continúa con
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.8)',
            color: '#4b5563',
            border: '1px solid rgba(226, 232, 240, 0.5)',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.5)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          {' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
        </>
        )}
      </div>
    </div>
  );
};