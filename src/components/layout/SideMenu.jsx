import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../../auth/AuthContext.jsx'
import Avatar from '../ui/Avatar/Avatar.jsx'
import Icon from '../ui/Icon.jsx'
import { NAV_PRINCIPAL, NAV_SECUNDARIA } from './navegacion.js'
import './SideMenu.css'

// Menú lateral (hamburguesa). Se cierra con Escape, con el fondo o al navegar.
export default function SideMenu({ open, onClose }) {
  const { usuario, listo, salir } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={`sidemenu ${open ? 'sidemenu--open' : ''}`} aria-hidden={!open}>
      <div className="sidemenu__backdrop" onClick={onClose} />
      <nav className="sidemenu__panel" aria-label="Menú" inert={!open}>
        <button type="button" className="sidemenu__close" onClick={onClose} aria-label="Cerrar menú">
          <Icon name="close" size={26} />
        </button>
        <p className="sidemenu__title pixel">Menú</p>
        {listo && (
          <div className="sidemenu__cuenta">
            <Avatar perfil={usuario} size={40} />
            <span>
              <strong>{usuario.nombre}</strong>
              <small>@{usuario.usuario}</small>
            </span>
          </div>
        )}
        <ul>
          {NAV_PRINCIPAL.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === '/'} onClick={onClose} className="sidemenu__link">
                <Icon name={item.icon} size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <hr />
        <ul>
          {NAV_SECUNDARIA.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} onClick={onClose} className="sidemenu__link">
                {item.label}
              </NavLink>
            </li>
          ))}
          {listo ? (
            <li>
              <button
                type="button"
                className="sidemenu__link sidemenu__salir"
                onClick={async () => {
                  await salir()
                  onClose()
                  navigate('/')
                }}
              >
                Cerrar sesión
              </button>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={onClose} className="sidemenu__link">
                  Iniciar sesión
                </NavLink>
              </li>
              <li>
                <NavLink to="/registro" onClick={onClose} className="sidemenu__link">
                  Registrarse
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}
