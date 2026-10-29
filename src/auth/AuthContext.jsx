// Sesión del usuario disponible en toda la app: const { usuario, cargando } = useAuth()
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { servicio } from '../servicios/index.js'

const AuthContext = createContext({ usuario: null, cargando: true })

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(
    () =>
      servicio.escucharSesion((u) => {
        setUsuario(u)
        setCargando(false)
      }),
    [],
  )

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      // Hay sesión y el perfil (con nombre de usuario) ya está listo
      listo: Boolean(usuario?.usuario),
      registrar: servicio.registrar,
      ingresar: servicio.ingresar,
      ingresarConGoogle: servicio.ingresarConGoogle,
      recuperarClave: servicio.recuperarClave,
      salir: servicio.salir,
      actualizarPerfil: (cambios) => servicio.actualizarPerfil(usuario.uid, cambios),
    }),
    [usuario, cargando],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
