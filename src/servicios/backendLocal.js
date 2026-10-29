// =========================================================
// Motor LOCAL (respaldo): misma interfaz que backendFirebase.js,
// pero guarda cuentas, proyectos y reseñas en ESTE navegador.
// Se usa automáticamente mientras Firebase no esté configurado,
// así el sitio funciona y se puede probar sin conexión a la nube.
// =========================================================
import { ErrorDevNet, normalizarUsuario, perfilInicial } from './comun.js'

const CLAVE = 'devnet-local-v1'
const vacio = { cuentas: {}, perfiles: {}, sesion: null, proyectos: [], resenas: [] }

function leer() {
  try {
    return { ...vacio, ...JSON.parse(localStorage.getItem(CLAVE)) }
  } catch {
    return { ...vacio }
  }
}

let datos = leer()
const oyentes = new Set()

function guardar(cambio) {
  datos = { ...datos, ...cambio }
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos))
  } catch {
    // almacenamiento lleno o bloqueado
  }
  oyentes.forEach((fn) => fn())
}

function escuchar(fn) {
  oyentes.add(fn)
  const otraPestana = (e) => e.key === CLAVE && ((datos = leer()), fn())
  window.addEventListener('storage', otraPestana)
  fn()
  return () => {
    oyentes.delete(fn)
    window.removeEventListener('storage', otraPestana)
  }
}

async function hash(texto) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto))
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const nuevoId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
const pausa = () => new Promise((r) => setTimeout(r, 250))

/* ---------------- Sesión ---------------- */

export function escucharSesion(callback) {
  return escuchar(() => {
    const uid = datos.sesion
    callback(uid && datos.perfiles[uid] ? { ...datos.perfiles[uid], uid, correo: datos.perfiles[uid].correo } : null)
  })
}

export async function registrar({ correo, clave, usuario, nombre, rol }) {
  await pausa()
  const email = correo.trim().toLowerCase()
  const nombreLimpio = normalizarUsuario(usuario)
  if (datos.cuentas[email]) throw new ErrorDevNet('auth/email-already-in-use')
  if (clave.length < 6) throw new ErrorDevNet('auth/weak-password')
  if (Object.values(datos.perfiles).some((p) => p.usuario === nombreLimpio)) throw new ErrorDevNet('usuario-ocupado')
  const uid = nuevoId()
  guardar({
    cuentas: { ...datos.cuentas, [email]: { uid, clave: await hash(clave) } },
    perfiles: { ...datos.perfiles, [uid]: { ...perfilInicial({ usuario: nombreLimpio, nombre, rol }), uid, correo: email, creadoEn: Date.now() } },
    sesion: uid,
  })
}

export async function ingresar(correo, clave) {
  await pausa()
  const cuenta = datos.cuentas[correo.trim().toLowerCase()]
  if (!cuenta || cuenta.clave !== (await hash(clave))) throw new ErrorDevNet('auth/invalid-credential')
  guardar({ sesion: cuenta.uid })
}

export async function ingresarConGoogle() {
  throw new ErrorDevNet('auth/operation-not-allowed') // requiere Firebase
}

export async function recuperarClave() {
  await pausa() // en modo local no se envían correos
}

export async function salir() {
  guardar({ sesion: null })
}

export async function obtenerPerfil(usuario) {
  const nombre = normalizarUsuario(usuario)
  return Object.values(datos.perfiles).find((p) => p.usuario === nombre) ?? null
}

export async function actualizarPerfil(uid, cambios) {
  const { usuario: _u, uid: _id, ...permitidos } = cambios
  guardar({ perfiles: { ...datos.perfiles, [uid]: { ...datos.perfiles[uid], ...permitidos } } })
}

/* ---------------- Proyectos y reseñas ---------------- */

export function escucharProyectos(callback) {
  return escuchar(() => callback(datos.proyectos.map((p) => ({ ...p, publicadoPorUsuario: true }))))
}

export function escucharResenas(callback) {
  return escuchar(() => callback(datos.resenas))
}

export async function crearProyecto(proyecto, autor) {
  await pausa()
  const id = nuevoId()
  guardar({ proyectos: [{ ...proyecto, id, autor: autor.usuario, autorUid: autor.uid, creadoEn: Date.now() }, ...datos.proyectos] })
  return id
}

export async function eliminarProyecto(id) {
  guardar({ proyectos: datos.proyectos.filter((p) => p.id !== id) })
}

export async function crearResena({ proyectoId, texto, estrellas }, autor) {
  guardar({
    resenas: [{ id: nuevoId(), proyectoId, texto, estrellas, autor: autor.usuario, autorUid: autor.uid, fecha: Date.now() }, ...datos.resenas],
  })
}
