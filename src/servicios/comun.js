// Utilidades compartidas por los dos motores (Firebase y local)

export class ErrorDevNet extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

// "Mi_Nombre 22" → "mi_nombre22" (3–20 caracteres: letras, números y _)
export function normalizarUsuario(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20)
}

export function perfilInicial({ usuario, nombre, rol, avatar }) {
  return {
    usuario,
    nombre: (nombre || usuario).slice(0, 40),
    rol: rol || 'Creador indie',
    avatar: avatar || '',
    sobreMi: '',
    habilidades: [],
  }
}

// Mensajes de error en español para Firebase y para el modo local
const MENSAJES = {
  'usuario-ocupado': 'Ese nombre de usuario ya está en uso. Prueba con otro.',
  'usuario-invalido': 'El usuario debe tener entre 3 y 20 caracteres: letras, números o _.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'No hay ninguna cuenta con ese correo.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a intentar.',
  'auth/popup-closed-by-user': 'Se cerró la ventana de Google antes de terminar.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase (Authentication → Configuración → Dominios autorizados).',
  'auth/operation-not-allowed': 'Este método de inicio de sesión no está activado en Firebase.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  'permission-denied': 'No tienes permiso para hacer esto. Revisa que hayas iniciado sesión.',
  'archivo-grande': 'El archivo supera el tamaño máximo permitido.',
  'formato-invalido': 'Formato de archivo no soportado.',
  'subida-fallida': 'No se pudo subir el archivo. Revisa la configuración de Cloudinary.',
  'requiere-sesion': 'Inicia sesión para continuar.',
  'cloudinary-sin-configurar': 'Para subir modelos 3D falta configurar Cloudinary en src/servicios/config.js.',
}

export function mensajeError(error) {
  return MENSAJES[error?.code] ?? 'Ocurrió un error inesperado. Intenta de nuevo.'
}
