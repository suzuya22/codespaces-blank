// =========================================================
// CONFIGURACIÓN DE SERVICIOS EXTERNOS
// 1) Firebase  → cuentas de usuario + base de datos (proyectos y reseñas)
// 2) Cloudinary → archivos (modelos 3D, portadas y avatares)
//
// Pega aquí los datos de tu proyecto (ver FIREBASE.md, pasos 1 a 5).
// Estos valores NO son secretos: la seguridad la dan las reglas de Firestore
// (archivo firestore.rules) y el preset de Cloudinary.
// =========================================================

export const firebaseConfig = {
  apiKey: 'AIzaSyB2Z8qEQ10xJnKT1SLNuJ0r03ilfg1T7PI',
  authDomain: 'devnet-4e1a2.firebaseapp.com',
  projectId: 'devnet-4e1a2',
  storageBucket: 'devnet-4e1a2.firebasestorage.app',
  messagingSenderId: '449820929439',
  appId: '1:449820929439:web:6f463703026e3bc04a61aa',
}

export const cloudinaryConfig = {
  cloudName: 'psviczyr',
  uploadPreset: 'devnet_publico', // preset "Unsigned" creado en Cloudinary
}

// Tamaño máximo por archivo (límite del plan gratuito de Cloudinary)
export const MAX_MB = 10

export const FORMATOS_3D = ['glb', 'gltf', 'obj', 'stl', 'fbx']

const configurado = (v) => typeof v === 'string' && v.length > 0 && !v.startsWith('PEGA_AQUI')

// Si Firebase no está configurado, el sitio funciona en "modo local" (datos en este navegador)
export const MODO = configurado(firebaseConfig.apiKey) ? 'firebase' : 'local'
export const CLOUDINARY_LISTO = configurado(cloudinaryConfig.cloudName)
