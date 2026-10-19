import { Link } from 'react-router'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Columna 1: Marca & Misión */}
        <div className="footer__col footer__col--brand">
          <div className="footer__brand">
            <img src="images/logos/dv-logo.png" alt="DevNet" className="footer__logo-img" />
            <span className="pixel footer__logo-text">DevNet</span>
          </div>
          <p className="footer__desc">
            Plataforma colaborativa para conectar creadores indie, transformar ideas en prototipos jugables y democratizar el feedback real.
          </p>
        </div>

        {/* Columna 2: Explorar */}
        <div className="footer__col">
          <h4 className="footer__heading">EXPLORAR</h4>
          <ul className="footer__list">
            <li><Link to="/galeria">Videojuegos Indie</Link></li>
            <li><Link to="/galeria">Assets Animados</Link></li>
            <li><Link to="/galeria?q=paletas">Paletas de Color</Link></li>
            <li><Link to="/galeria?q=modelos">Modelos 3D</Link></li>
            <li><Link to="/galeria?estado=equipo">Buscando Equipo</Link></li>
          </ul>
        </div>

        {/* Columna 3: Comunidad */}
        <div className="footer__col">
          <h4 className="footer__heading">COMUNIDAD</h4>
          <ul className="footer__list">
            <li><a href="https://discord.com" target="_blank" rel="noreferrer">💬 Servidor Discord ↗</a></li>
            <li><a href="https://itch.io" target="_blank" rel="noreferrer">🎮 Comunidad Itch.io ↗</a></li>
            <li><a href="https://x.com" target="_blank" rel="noreferrer">🐦 Twitter / X ↗</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">💻 Repositorio GitHub ↗</a></li>
          </ul>
        </div>

        {/* Columna 4: Créditos & Fundadores */}
        <div className="footer__col">
          <h4 className="footer__heading">CRÉDITOS</h4>
          <ul className="footer__list">
            <li><Link to="/creditos">Manifiesto DevNet</Link></li>
            <li><Link to="/creditos">Juan Sebastián López (Game Dev)</Link></li>
            <li><Link to="/creditos">Juan Pablo (UI/UX Architect)</Link></li>
            <li><Link to="/registro">Términos &amp; Condiciones</Link></li>
          </ul>
        </div>

        {/* Barra inferior */}
        <div className="footer__bottom">
          <span>© 2026 DevNet. Todos los derechos reservados.</span>
          <span className="footer__spec">Arquitectura Desktop PC (1440px)</span>
        </div>
      </div>
    </footer>
  )
}

