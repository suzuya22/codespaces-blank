import { PixelSky } from '../PixelArt.jsx'
import './HeroBanner.css'

// Banner con cielo pixelado (pantallas de acceso y "Acerca de")
export default function HeroBanner({ title, subtitle, tall = false }) {
  return (
    <header className="hero-banner">
      <PixelSky className={`hero-banner__sky ${tall ? 'hero-banner__sky--wide' : ''}`} />
      {tall && <PixelSky tall className="hero-banner__sky hero-banner__sky--tall" />}
      <div className="hero-banner__text">
        <p className="hero-banner__title">{title}</p>
        {subtitle && <p className="hero-banner__subtitle">{subtitle}</p>}
      </div>
    </header>
  )
}
