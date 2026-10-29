// =========================================================
// Motor FIREBASE: Authentication + Cloud Firestore
// Colecciones:
//   usuarios/{uid}             → perfil público de cada cuenta
//   usuariosPorNombre/{nombre} → { uid } (garantiza nombres de usuario únicos)
//   proyectos/{id}             → proyectos publicados por cualquier cuenta
//   resenas/{id}               → reseñas { proyectoId, estrellas, texto, autor... }
// =========================================================
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { firebaseConfig } from './config.js'
import { ErrorDevNet, normalizarUsuario, perfilInicial } from './comun.js'

let instancia = null
function fb() {
  if (!instancia) {
    const app = initializeApp(firebaseConfig)
    instancia = { auth: getAuth(app), db: getFirestore(app) }
  }
  return instancia
}

const aMilis = (t) => (t?.toMillis ? t.toMillis() : typeof t === 'number' ? t : Date.now())

// Reserva el nombre de usuario y crea el perfil en una sola transacción
async function crearPerfil(user, datos) {
  const { db } = fb()
  const nombre = normalizarUsuario(datos.usuario)
  const refNombre = doc(db, 'usuariosPorNombre', nombre)
  await runTransaction(db, async (tx) => {
    const ocupado = await tx.get(refNombre)
    if (ocupado.exists()) throw new ErrorDevNet('usuario-ocupado')
    tx.set(refNombre, { uid: user.uid })
    tx.set(doc(db, 'usuarios', user.uid), { ...perfilInicial({ ...datos, usuario: nombre }), uid: user.uid, creadoEn: serverTimestamp() })
  })
  return nombre
}

/* ---------------- Sesión ---------------- */

export function escucharSesion(callback) {
  const { auth, db } = fb()
  let cancelarPerfil = () => {}
  const cancelarAuth = onAuthStateChanged(auth, (user) => {
    cancelarPerfil()
    if (!user) return callback(null)
    // Mientras se crea el perfil (registro) se entrega un perfil mínimo
    callback({ uid: user.uid, correo: user.email, usuario: null, nombre: user.displayName ?? '', cargandoPerfil: true })
    cancelarPerfil = onSnapshot(doc(db, 'usuarios', user.uid), (snap) => {
      if (snap.exists()) callback({ ...snap.data(), uid: user.uid, correo: user.email })
    })
  })
  return () => {
    cancelarPerfil()
    cancelarAuth()
  }
}

export async function registrar({ correo, clave, usuario, nombre, rol }) {
  const { auth, db } = fb()
  const nombreLimpio = normalizarUsuario(usuario)
  if ((await getDoc(doc(db, 'usuariosPorNombre', nombreLimpio))).exists()) throw new ErrorDevNet('usuario-ocupado')
  const cred = await createUserWithEmailAndPassword(auth, correo, clave)
  try {
    await crearPerfil(cred.user, { usuario: nombreLimpio, nombre, rol })
    await updateProfile(cred.user, { displayName: nombre || nombreLimpio })
  } catch (error) {
    await deleteUser(cred.user) // si el nombre se ocupó en el último segundo, no dejamos una cuenta a medias
    throw error
  }
}

export async function ingresar(correo, clave) {
  await signInWithEmailAndPassword(fb().auth, correo, clave)
}

export async function ingresarConGoogle() {
  const { auth, db } = fb()
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
  if ((await getDoc(doc(db, 'usuarios', user.uid))).exists()) return
  // Primera vez con Google: se crea un nombre de usuario a partir del correo
  const base = normalizarUsuario(user.email?.split('@')[0] || 'creador').slice(0, 14) || 'creador'
  for (let intento = 0; intento < 6; intento++) {
    const candidato = intento === 0 ? base : `${base}_${Math.floor(Math.random() * 9000 + 1000)}`
    try {
      await crearPerfil(user, { usuario: candidato, nombre: user.displayName ?? candidato, rol: 'Creador indie', avatar: user.photoURL })
      return
    } catch (error) {
      if (error.code !== 'usuario-ocupado') throw error
    }
  }
  throw new ErrorDevNet('usuario-ocupado')
}

export const recuperarClave = (correo) => sendPasswordResetEmail(fb().auth, correo)
export const salir = () => signOut(fb().auth)

export async function obtenerPerfil(usuario) {
  const { db } = fb()
  const ref = await getDoc(doc(db, 'usuariosPorNombre', normalizarUsuario(usuario)))
  if (!ref.exists()) return null
  const perfil = await getDoc(doc(db, 'usuarios', ref.data().uid))
  return perfil.exists() ? perfil.data() : null
}

export async function actualizarPerfil(uid, cambios) {
  // El nombre de usuario y el uid no se pueden cambiar (también lo impiden las reglas)
  const { usuario: _u, uid: _id, ...permitidos } = cambios
  await updateDoc(doc(fb().db, 'usuarios', uid), permitidos)
}

/* ---------------- Proyectos y reseñas ---------------- */

export function escucharProyectos(callback, alError) {
  const q = query(collection(fb().db, 'proyectos'), orderBy('creadoEn', 'desc'))
  return onSnapshot(
    q,
    (snap) =>
      callback(
        snap.docs.map((d) => {
          const data = d.data({ serverTimestamps: 'estimate' })
          return { ...data, id: d.id, creadoEn: aMilis(data.creadoEn), publicadoPorUsuario: true }
        }),
      ),
    alError,
  )
}

export function escucharResenas(callback, alError) {
  return onSnapshot(
    collection(fb().db, 'resenas'),
    (snap) =>
      callback(
        snap.docs.map((d) => {
          const data = d.data({ serverTimestamps: 'estimate' })
          return { ...data, id: d.id, fecha: aMilis(data.fecha) }
        }),
      ),
    alError,
  )
}

export async function crearProyecto(datos, autor) {
  const ref = await addDoc(collection(fb().db, 'proyectos'), {
    ...datos,
    autor: autor.usuario,
    autorUid: autor.uid,
    creadoEn: serverTimestamp(),
  })
  return ref.id
}

export const eliminarProyecto = (id) => deleteDoc(doc(fb().db, 'proyectos', id))

export async function crearResena({ proyectoId, texto, estrellas }, autor) {
  await addDoc(collection(fb().db, 'resenas'), {
    proyectoId,
    texto,
    estrellas,
    autor: autor.usuario,
    autorUid: autor.uid,
    fecha: serverTimestamp(),
  })
}
