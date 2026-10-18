import './AuthShell.css'

// Plantilla para pantallas de acceso (login, registro, recuperar) idéntica a Figma
export default function AuthShell({
  title,
  children,
  bannerTitle = 'BIENVENIDO A DEVNET',
  bannerSubtitle = 'ÚNETE A LA COMUNIDAD INDIE',
}) {
  return (
    <div className="auth">
      <div className="auth__banner">
        <div className="auth__banner-media">
          <img
            src="images/banners/auth-banner.png"
            alt="DevNet"
            className="auth__banner-img"
          />
        </div>
        <div className="auth__banner-text">
          <p className="auth__banner-title">{bannerTitle}</p>
          {bannerSubtitle && <p className="auth__banner-sub">{bannerSubtitle}</p>}
        </div>
      </div>

      <section className="auth__panel">
        {title && <h1 className="auth__title">{title.toUpperCase()}</h1>}
        {children}
        <div className="auth__logo">
          <img src="images/logos/dv-logo.png" alt="DevNet" className="auth__logo-img" />
        </div>
      </section>
    </div>
  )
}
