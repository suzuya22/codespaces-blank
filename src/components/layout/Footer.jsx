import { Link } from 'react-router'
import { Logo } from '../ui/PixelArt.jsx'
import './Footer.css'

// Pie de página: visible desde tablet (en móvil lo reemplaza la barra inferior)
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo size={30} />
          <span className="pixel">DevNet</span>
        </div>
        <p className="muted">Donde el desarrollo indie cobra vida.</p>
        <nav className="footer__links" aria-label="Pie de página">
          <Link to="/creditos">Acerca de</Link>
          <Link to="/registro">Únete</Link>
          <Link to="/publicar">Publicar</Link>
        </nav>
      </div>
    </footer>
  )
}
