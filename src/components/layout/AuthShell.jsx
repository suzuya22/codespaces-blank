import HeroBanner from '../ui/HeroBanner/HeroBanner.jsx'
import { Logo } from '../ui/PixelArt.jsx'
import './AuthShell.css'

// Plantilla para pantallas de acceso (login, registro, recuperar)
// Móvil: banner arriba y formulario debajo. Tablet: dos columnas.
export default function AuthShell({ title, children, bannerTitle = 'Bienvenido a DevNet', bannerSubtitle = 'Únete a la comunidad indie' }) {
  return (
    <div className="auth">
      <div className="auth__banner">
        <HeroBanner title={bannerTitle} subtitle={bannerSubtitle} tall />
      </div>
      <section className="auth__panel">
        <h1 className="auth__title">{title}</h1>
        {children}
        <div className="auth__logo">
          <Logo size={44} />
        </div>
      </section>
    </div>
  )
}
