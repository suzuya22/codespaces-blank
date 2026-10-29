// =========================================================
// Motor LOCAL (respaldo): misma interfaz que backendFirebase.js,
// pero guarda cuentas, proyectos y reseñas en ESTE navegador.
// Se usa automáticamente mientras Firebase no esté configurado,
// así el sitio funciona y se puede probar sin conexión a la nube.
// =========================================================
import { ErrorDevNet, normalizarUsuario, perfilInicial } from './comun.js'

const CLAVE = 'devnet-local-v1'
const vacio = { cuentas: {}, perfiles: {}, sesion: null, proyectos: [], resenas: [], conversaciones: {}, mensajes: {}, solicitudes: {} }

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

/* ---------------- Mensajes entre usuarios ---------------- */

export const idConversacion = (uidA, uidB) => [uidA, uidB].sort().join('_')

export function escucharConversaciones(uid, callback) {
  return escuchar(() => callback(Object.values(datos.conversaciones).filter((c) => c.participantes.includes(uid))))
}

export function escucharMensajes(idConv, callback) {
  return escuchar(() => callback(datos.mensajes[idConv] ?? []))
}

export async function abrirConversacion(yo, otro) {
  const id = idConversacion(yo.uid, otro.uid)
  if (!datos.conversaciones[id]) {
    guardar({
      conversaciones: {
        ...datos.conversaciones,
        [id]: { id, participantes: [yo.uid, otro.uid].sort(), nombres: { [yo.uid]: yo.usuario, [otro.uid]: otro.usuario }, ultimo: null, leido: {}, actualizado: Date.now() },
      },
    })
  }
  return id
}

export async function enviarMensaje(idConv, yo, texto) {
  const ahora = Date.now()
  const conv = datos.conversaciones[idConv]
  guardar({
    mensajes: { ...datos.mensajes, [idConv]: [...(datos.mensajes[idConv] ?? []), { id: nuevoId(), autorUid: yo.uid, texto, fecha: ahora }] },
    conversaciones: {
      ...datos.conversaciones,
      [idConv]: { ...conv, ultimo: { texto: texto.slice(0, 120), autorUid: yo.uid, fecha: ahora }, actualizado: ahora, leido: { ...conv.leido, [yo.uid]: ahora } },
    },
  })
}

export async function marcarLeida(idConv, uid) {
  const conv = datos.conversaciones[idConv]
  if (!conv) return
  guardar({ conversaciones: { ...datos.conversaciones, [idConv]: { ...conv, leido: { ...conv.leido, [uid]: Date.now() } } } })
}

/* ---------------- Solicitudes para unirse a un proyecto ---------------- */

export function escucharSolicitudes(uid, callback) {
  return escuchar(() => {
    const todas = Object.values(datos.solicitudes)
    callback({ recibidas: todas.filter((s) => s.paraUid === uid), enviadas: todas.filter((s) => s.deUid === uid) })
  })
}

export async function enviarSolicitud(proyecto, yo, mensaje) {
  const id = `${proyecto.id}_${yo.uid}`
  if (datos.solicitudes[id]) throw new ErrorDevNet('permission-denied')
  guardar({
    solicitudes: {
      ...datos.solicitudes,
      [id]: {
        id,
        proyectoId: proyecto.id,
        proyectoTitulo: proyecto.titulo,
        deUid: yo.uid,
        deUsuario: yo.usuario,
        deRol: yo.rol ?? '',
        paraUid: proyecto.autorUid,
        paraUsuario: proyecto.autor,
        mensaje: mensaje.slice(0, 500),
        estado: 'pendiente',
        fecha: Date.now(),
      },
    },
  })
}

export async function responderSolicitud(id, estado) {
  guardar({ solicitudes: { ...datos.solicitudes, [id]: { ...datos.solicitudes[id], estado } } })
}

export async function cancelarSolicitud(id) {
  const { [id]: _borrada, ...resto } = datos.solicitudes
  guardar({ solicitudes: resto })
}
