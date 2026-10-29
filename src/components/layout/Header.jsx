import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import Icon from '../ui/Icon.jsx'
import Avatar from '../ui/Avatar/Avatar.jsx'
import { useAuth } from '../../auth/AuthContext.jsx'
import { NAV_PRINCIPAL } from './navegacion.js'
import './Header.css'

export default function Header({ onMenu }) {
  const [q, setQ] = useState('')
  const { usuario, listo } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/galeria?q=${encodeURIComponent(q.trim())}`)
    }
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand" aria-label="DevNet, ir al inicio">
          <img src="images/logos/dv-logo.png" alt="DevNet" className="header__logo-img" />
          <div className="header__brand-text">
            <span className="header__name pixel">DevNet</span>
            <span className="header__sub">Comunidad Indie</span>
          </div>
        </Link>

        {/* Navegación visible en tablet/escritorio */}
        <nav className="header__nav" aria-label="Principal">
          {NAV_PRINCIPAL.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="header__link">
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/creditos" className="header__link">
            Manifiesto
          </NavLink>
        </nav>

        <div className="header__right">
          <form className="header__search" onSubmit={handleSearch}>
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Buscar prototipos"
            />
          </form>

          <Link to="/publicar" className="header__cta">
            <Icon name="plus" size={16} /> Publicar
          </Link>

          {listo ? (
            <Link to={`/perfil/${usuario.usuario}`} className="header__profile-chip" title="Ver mi perfil">
              <Avatar perfil={usuario} size={26} className="header__profile-avatar" />
              <span className="header__profile-name">@{usuario.usuario}</span>
            </Link>
          ) : (
            <Link to="/login" className="header__login">
              Iniciar sesión
            </Link>
          )}

          <button type="button" className="header__menu" onClick={onMenu} aria-label="Abrir menú">
            <Icon name="menu" size={26} />
          </button>
        </div>
      </div>
    </header>
  )
}

