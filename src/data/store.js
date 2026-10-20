// =========================================================
// Almacén global de DevNet (sin backend)
// Guarda en el navegador (localStorage) lo que el usuario crea:
//   - proyectos publicados
//   - reseñas de cada proyecto
//   - mensajes del chat
// Cualquier componente que use estos hooks se actualiza al instante
// cuando algo cambia, en todas las páginas (e incluso en otras pestañas).
// =========================================================
import { useMemo, useSyncExternalStore } from 'react'
import { PROYECTOS, CONVERSACIONES, USUARIOS } from './proyectos.js'

const CLAVE = 'devnet-datos-v1'
const ESTADO_INICIAL = { publicados: [], resenas: {}, chats: null, leidos: {} }

function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE))
    return { ...ESTADO_INICIAL, ...guardado }
  } catch {
    return { ...ESTADO_INICIAL }
  }
}

let estado = cargar()
const suscriptores = new Set()

function actualizar(cambio) {
  estado = { ...estado, ...cambio(estado) }
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    // Almacenamiento lleno o bloqueado: los datos viven solo en esta sesión
  }
  suscriptores.forEach((fn) => fn())
}

function suscribir(fn) {
  suscriptores.add(fn)
  // Sincroniza si el usuario tiene el sitio abierto en otra pestaña
  const alCambiarOtraPestana = (e) => {
    if (e.key === CLAVE) {
      estado = cargar()
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

// Combina los datos base del proyecto con las reseñas que dejó la comunidad
function conEstadisticas(proyecto, resenas = []) {
  const totalFeedbacks = proyecto.feedbacks + resenas.length
  const sumaEstrellas = proyecto.rating * proyecto.feedbacks + resenas.reduce((acc, r) => acc + r.estrellas, 0)
  const rating = totalFeedbacks ? Math.round((sumaEstrellas / totalFeedbacks) * 10) / 10 : 0
  return { ...proyecto, feedbacks: totalFeedbacks, rating, resenas }
}

// Lista completa: primero los publicados por el usuario (más recientes arriba) y luego los del sitio
export function useProyectos() {
  const { publicados, resenas } = useEstado()
  return useMemo(
    () => [...publicados, ...PROYECTOS].map((p) => conEstadisticas(p, resenas[p.id])),
    [publicados, resenas],
  )
}

export function useProyecto(id) {
  const proyectos = useProyectos()
  return proyectos.find((p) => p.id === id)
}

function crearId(titulo) {
  const base = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${base || 'proyecto'}-${Date.now().toString(36)}`
}

export function publicarProyecto({ titulo, sinopsis, etiquetas, motor, portada, archivo }) {
  const proyecto = {
    id: crearId(titulo),
    titulo: titulo.trim(),
    autor: 'suzuya',
    motor,
    estado: 'test',
    version: 'Prototipo',
    generos: etiquetas.length ? etiquetas : ['Indie'],
    feedbacks: 0,
    rating: 0,
    nuevo: true,
    publicadoPorUsuario: true,
    creadoEn: Date.now(),
    portada: portada || undefined,
    paleta: ['#1a0f2e', '#6b2fb3', '#e04f6c', '#f2c14e'],
    sinopsis: sinopsis.trim(),
    busca: ['Playtesters'],
    build: archivo || undefined,
  }
  actualizar((s) => ({ publicados: [proyecto, ...s.publicados] }))
  return proyecto.id
}

export function eliminarProyecto(id) {
  actualizar((s) => ({ publicados: s.publicados.filter((p) => p.id !== id) }))
}

/* ---------------- Reseñas ---------------- */

export function agregarResena(proyectoId, { texto, estrellas }) {
  const nueva = { texto, estrellas, autor: 'suzuya', fecha: Date.now() }
  actualizar((s) => ({
    resenas: { ...s.resenas, [proyectoId]: [nueva, ...(s.resenas[proyectoId] ?? [])] },
  }))
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
