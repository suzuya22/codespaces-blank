// Actividad de la cuenta en vivo: conversaciones y solicitudes para unirse a proyectos.
// const { conversaciones, recibidas, enviadas, noLeidos, pendientes } = useActividad()
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { servicio } from '../servicios/index.js'
import { useAuth } from './AuthContext.jsx'

const VACIO = { uid: null, conversaciones: [], recibidas: [], enviadas: [] }
const ActividadContext = createContext({ ...VACIO, noLeidos: 0, pendientes: 0 })

// Una conversación tiene mensajes sin leer si el último lo escribió la otra persona después de la última visita
export const sinLeer = (conv, uid) => Boolean(conv.ultimo && conv.ultimo.autorUid !== uid && (conv.leido?.[uid] ?? 0) < conv.ultimo.fecha)

export function ActividadProvider({ children }) {
  const { usuario, listo } = useAuth()
  const uid = listo ? usuario.uid : null
  const [datos, setDatos] = useState(VACIO)

  useEffect(() => {
    if (!uid) return
    const fallo = (error) => console.warn('DevNet: no se pudo leer la actividad', error?.code)
    const quitarConv = servicio.escucharConversaciones(
      uid,
      (conversaciones) => setDatos((d) => ({ ...(d.uid === uid ? d : { ...VACIO, uid }), conversaciones })),
      fallo,
    )
    const quitarSol = servicio.escucharSolicitudes(
      uid,
      ({ recibidas, enviadas }) => setDatos((d) => ({ ...(d.uid === uid ? d : { ...VACIO, uid }), recibidas, enviadas })),
      fallo,
    )
    return () => {
      quitarConv()
      quitarSol()
    }
  }, [uid])

  const valor = useMemo(() => {
    const actual = datos.uid === uid ? datos : { ...VACIO, uid }
    const conversaciones = [...actual.conversaciones].sort((a, b) => (b.actualizado ?? 0) - (a.actualizado ?? 0))
    const recibidas = [...actual.recibidas].sort((a, b) => (b.fecha ?? 0) - (a.fecha ?? 0))
    return {
      ...actual,
      conversaciones,
      recibidas,
      noLeidos: conversaciones.filter((c) => sinLeer(c, uid)).length,
      pendientes: recibidas.filter((s) => s.estado === 'pendiente').length,
    }
  }, [datos, uid])

  return <ActividadContext.Provider value={valor}>{children}</ActividadContext.Provider>
}

export const useActividad = () => useContext(ActividadContext)
