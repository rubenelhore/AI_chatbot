# 🔐 Instrucciones para Habilitar Google Authentication

## Problema Actual
Error: `auth/operation-not-allowed` - Google Sign-In no está habilitado en Firebase

## Solución Paso a Paso

### 1. Acceder a Firebase Console
Abre este enlace en tu navegador:
👉 https://console.firebase.google.com/project/ai-chatbot-c0bed/authentication/providers

### 2. Habilitar Google Sign-In
1. En la lista de proveedores de autenticación, busca **Google**
2. Haz clic en el proveedor **Google**
3. En la ventana que se abre:
   - Activa el switch **Enable** (arriba a la derecha)
   - En **Project support email**: ingresa tu email
   - En **Project public-facing name**: puedes dejar "AI Document Chat"
   - Haz clic en **Save**

### 3. Verificar Configuración
- Google debe aparecer como "Enabled" ✅
- Debe mostrar tu email de soporte configurado

### 4. Probar la Autenticación
1. Recarga la aplicación en http://localhost:3001/
2. Intenta iniciar sesión con Google nuevamente
3. Debería abrirse el popup de Google para seleccionar tu cuenta

## Configuración Adicional (Opcional)

### Para Producción
Si planeas usar esto en producción, también debes:

1. **Agregar dominio autorizado:**
   - Ve a Authentication > Settings > Authorized domains
   - Agrega tu dominio de producción

2. **Configurar OAuth Consent Screen:**
   - Ve a Google Cloud Console
   - APIs & Services > OAuth consent screen
   - Configura la información de tu aplicación

## Solución de Problemas

| Error | Solución |
|-------|----------|
| `auth/operation-not-allowed` | Habilita Google en Firebase Console |
| `auth/popup-blocked` | Permite popups en tu navegador |
| `auth/unauthorized-domain` | Agrega el dominio a la lista de autorizados |
| `auth/cancelled-popup-request` | El usuario cerró el popup antes de completar |

## Verificación Rápida
Una vez habilitado, puedes verificar que funciona con:
1. La página de prueba: `test-google-auth.html`
2. O directamente en tu aplicación

## ¿Necesitas más ayuda?
Si el problema persiste después de habilitar Google Sign-In:
1. Verifica que las API Keys estén correctas en `.env`
2. Revisa que el proyecto de Firebase sea el correcto
3. Intenta en una ventana de incógnito para descartar problemas de caché