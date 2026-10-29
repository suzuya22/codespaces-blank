// =========================================================
// Almacén global de DevNet
//   - Proyectos y reseñas: vienen del servicio activo (Firebase o modo local,
//     ver src/servicios). Todas las cuentas ven los proyectos de las demás.
//   - Mensajes del chat: se guardan en este navegador (localStorage).
// Cualquier componente que use estos hooks se actualiza al instante.
// =========================================================
import { useMemo, useSyncExternalStore } from 'react'
import { PROYECTOS, CONVERSACIONES, USUARIOS } from './proyectos.js'
import { servicio } from '../servicios/index.js'

const CLAVE = 'devnet-datos-v1'
const ESTADO_INICIAL = { chats: null, leidos: {} }

function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE))
    return { ...ESTADO_INICIAL, ...guardado }
  } catch {
    return { ...ESTADO_INICIAL }
  }
}

let estado = { ...cargar(), remotos: [], resenas: [], errorRemoto: null, cargado: false }
const suscriptores = new Set()

// Datos en vivo desde el servicio (se conectan una sola vez, al primer uso)
let conectado = false
function conectarServicio() {
  if (conectado) return
  conectado = true
  const alError = (error) => {
    estado = { ...estado, errorRemoto: error?.code ?? 'error', cargado: true }
    suscriptores.forEach((fn) => fn())
  }
  servicio.escucharProyectos((remotos) => {
    estado = { ...estado, remotos, errorRemoto: null, cargado: true }
    suscriptores.forEach((fn) => fn())
  }, alError)
  servicio.escucharResenas((resenas) => {
    estado = { ...estado, resenas }
    suscriptores.forEach((fn) => fn())
  }, alError)
}

function actualizar(cambio) {
  estado = { ...estado, ...cambio(estado) }
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ chats: estado.chats, leidos: estado.leidos }))
  } catch {
    // Almacenamiento lleno o bloqueado: los datos viven solo en esta sesión
  }
  suscriptores.forEach((fn) => fn())
}

function suscribir(fn) {
  conectarServicio()
  suscriptores.add(fn)
  // Sincroniza si el usuario tiene el sitio abierto en otra pestaña
  const alCambiarOtraPestana = (e) => {
    if (e.key === CLAVE) {
      estado = { ...estado, ...cargar() }
      fn()
    }
  }
  window.addEventListener('storage', alCambiarOtraPestana)
  return () => {
    suscriptores.delete(fn)
    window.removeEventListener('storage', alCambiarOtraPestana)
  }
}

function useEstado() {
  return useSyncExternalStore(suscribir, () => estado)
}

/* ---------------- Proyectos ---------------- */

const SIETE_DIAS = 7 * 24 * 60 * 60 * 1000

// Combina los datos base del proyecto con las reseñas de la comunidad
function conEstadisticas(proyecto, resenas = []) {
  const base = proyecto.feedbacks ?? 0
  const totalFeedbacks = base + resenas.length
  const sumaEstrellas = (proyecto.rating ?? 0) * base + resenas.reduce((acc, r) => acc + r.estrellas, 0)
  const rating = totalFeedbacks ? Math.round((sumaEstrellas / totalFeedbacks) * 10) / 10 : 0
  const esNuevo = Boolean(proyecto.creadoEn && Date.now() - proyecto.creadoEn < SIETE_DIAS)
  return { ...proyecto, feedbacks: totalFeedbacks, rating, resenas, nuevo: proyecto.nuevo || esNuevo, esNuevo }
}

// Lista completa: proyectos de todas las cuentas (más recientes arriba) + los de ejemplo del sitio
export function useProyectos() {
  const { remotos, resenas } = useEstado()
  return useMemo(() => {
    const porProyecto = {}
    for (const r of [...resenas].sort((a, b) => (b.fecha ?? 0) - (a.fecha ?? 0))) {
      ;(porProyecto[r.proyectoId] ??= []).push(r)
    }
    return [...remotos, ...PROYECTOS].map((p) => conEstadisticas(p, porProyecto[p.id]))
  }, [remotos, resenas])
}

export function useProyecto(id) {
  const proyectos = useProyectos()
  return proyectos.find((p) => p.id === id)
}

// true cuando ya llegaron los proyectos de la base de datos
export function useProyectosCargados() {
  return useEstado().cargado
}

// Error al leer de Firebase (por ejemplo, reglas sin publicar)
export function useErrorRemoto() {
  return useEstado().errorRemoto
}

/** Publica un proyecto de la cuenta actual. Devuelve el id. */
export function publicarProyecto(datos, autor) {
  return servicio.crearProyecto(
    {
      titulo: datos.titulo.trim(),
      sinopsis: datos.sinopsis.trim(),
      generos: datos.etiquetas?.length ? datos.etiquetas : ['Indie'],
      motor: datos.motor,
      estado: datos.estado ?? 'test',
      version: datos.version?.trim() || 'Prototipo',
      portada: datos.portada ?? null,
      modelo: datos.modelo ?? null,
      enlaceJuego: datos.enlaceJuego?.trim() || null,
      busca: datos.busca?.length ? datos.busca : ['Playtesters'],
      paleta: ['#1a0f2e', '#6b2fb3', '#e04f6c', '#f2c14e'],
      feedbacks: 0,
      rating: 0,
    },
    autor,
  )
}

export const eliminarProyecto = (id) => servicio.eliminarProyecto(id)

/* ---------------- Reseñas ---------------- */

export function agregarResena(proyectoId, { texto, estrellas }, autor) {
  return servicio.crearResena({ proyectoId, texto, estrellas }, autor)
}

/* ---------------- Chat ---------------- */

const RESPUESTAS = [
  '¡Genial! Lo reviso y te escribo en un rato 🙌',
  'Me parece buena idea. ¿Lo hablamos en la próxima reunión?',
  'Perfecto, ya le paso esto al resto del equipo.',
  'Jajaja totalmente. Te mando la build actualizada esta noche.',
  '¿Me compartes una captura? Así lo veo más claro.',
]

export function useChats() {
  const { chats, leidos } = useEstado()
  return { chats: chats ?? CONVERSACIONES, leidos }
}

export function marcarLeido(usuario) {
  const chats = estado.chats ?? CONVERSACIONES
  const total = chats.find((c) => c.usuario === usuario)?.mensajes.length ?? 0
  if (estado.leidos[usuario] === total) return
  actualizar((s) => ({ leidos: { ...s.leidos, [usuario]: total } }))
}

function agregarMensaje(usuario, mensaje) {
  actualizar((s) => {
    const chats = s.chats ?? CONVERSACIONES
    return {
      chats: chats.map((c) => (c.usuario === usuario ? { ...c, mensajes: [...c.mensajes, mensaje] } : c)),
    }
  })
}

// Envía un mensaje y simula que el contacto responde unos segundos después
export function enviarMensaje(usuario, texto, alResponder) {
  agregarMensaje(usuario, { de: 'yo', texto, hora: Date.now() })
  const respuesta = RESPUESTAS[Math.floor(Math.random() * RESPUESTAS.length)]
  setTimeout(() => {
    agregarMensaje(usuario, { de: usuario, texto: respuesta, hora: Date.now() })
    alResponder?.()
  }, 1800 + Math.random() * 1200)
}

export function nombreUsuario(usuario) {
  return USUARIOS[usuario]?.nombre ?? usuario
}
