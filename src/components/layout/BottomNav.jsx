import { NavLink } from 'react-router'
import Icon from '../ui/Icon.jsx'
import { NAV_PRINCIPAL } from './navegacion.js'
import './BottomNav.css'

// Barra de navegación inferior (solo móvil)
export default function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Navegación inferior">
      {NAV_PRINCIPAL.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === '/'} className="bottomnav__item">
          <Icon name={item.icon} size={24} />
          <span className="bottomnav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
