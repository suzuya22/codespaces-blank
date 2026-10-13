import { Link, NavLink } from 'react-router'
import { Logo } from '../ui/PixelArt.jsx'
import Icon from '../ui/Icon.jsx'
import { NAV_PRINCIPAL } from './navegacion.js'
import './Header.css'

export default function Header({ onMenu }) {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand" aria-label="DevNet, ir al inicio">
          <Logo size={38} />
          <span className="header__name pixel">DevNet</span>
        </Link>

        {/* Navegación visible solo en tablet/escritorio */}
        <nav className="header__nav" aria-label="Principal">
          {NAV_PRINCIPAL.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="header__link">
              {item.label}
            </NavLink>
          ))}
          <Link to="/publicar" className="header__cta">
            <Icon name="plus" size={18} /> Publicar
          </Link>
        </nav>

        <button type="button" className="header__menu" onClick={onMenu} aria-label="Abrir menú">
          <Icon name="menu" size={28} />
        </button>
      </div>
    </header>
  )
}
