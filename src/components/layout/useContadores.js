import { useActividad } from '../../auth/ActividadContext.jsx'

// Números que se muestran como globito en la navegación: mensajes sin leer y solicitudes pendientes
export function useContadores() {
  const { noLeidos, pendientes } = useActividad()
  return { '/mensajes': noLeidos, '/perfil': pendientes }
}

export const textoContador = (n) => (n > 9 ? '9+' : String(n))
