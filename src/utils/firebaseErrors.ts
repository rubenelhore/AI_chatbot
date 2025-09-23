export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este correo electrónico ya está registrado',
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/operation-not-allowed': 'Este método de autenticación no está habilitado. Por favor, contacta al administrador.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este correo pero con otro método de inicio de sesión',
    'auth/popup-blocked': 'El navegador bloqueó la ventana emergente de inicio de sesión',
    'auth/popup-closed-by-user': 'Se cerró la ventana de inicio de sesión antes de completar el proceso',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Por favor, verifica tu conexión a internet',
    'auth/invalid-login-credentials': 'Correo o contraseña incorrectos',
  };

  return errorMessages[errorCode] || 'Ha ocurrido un error. Por favor, intenta de nuevo';
};