import HeroBanner from '../../components/ui/HeroBanner/HeroBanner.jsx'
import { Logo } from '../../components/ui/PixelArt.jsx'
import './Creditos.css'

const EQUIPO = [
  { nombre: 'Juan Sebastián López', rol: 'Lead Game Dev & UX Architect' },
  { nombre: 'Juan Pablo', rol: 'Lead UI/UX & Art Director' },
]

const REDES = [
  { nombre: 'Servidor de Discord', url: 'https://discord.com' },
  { nombre: 'Comunidad en itch.io', url: 'https://itch.io' },
  { nombre: 'Twitter / X', url: 'https://x.com' },
  { nombre: 'Repositorio GitHub', url: 'https://github.com/suzuya22/codespaces-blank' },
]

// Acerca de & contacto
function Creditos() {
  return (
    <div className="page creditos">
      <div className="creditos__banner">
        <HeroBanner title="Acerca de & contacto" />
      </div>

      <section className="creditos__manifiesto">
        <h1>Manifiesto</h1>
        <blockquote>
          “Creamos DevNet para conectar creadores indie, transformar ideas en proyectos jugables y fomentar el feedback real
          entre desarrolladores y artistas.”
        </blockquote>
      </section>

      <section className="creditos__bloque">
        <h2>Créditos del equipo fundador</h2>
        <ul className="creditos__equipo">
          {EQUIPO.map((p) => (
            <li key={p.nombre}>
              <strong>{p.nombre}</strong>
              <span className="muted">{p.rol}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="creditos__bloque">
        <h2>Comunidad y redes</h2>
        <ul className="creditos__redes">
          {REDES.map((r) => (
            <li key={r.nombre}>
              <a href={r.url} target="_blank" rel="noreferrer">
                [ {r.nombre} ↗ ]
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="creditos__logo">
        <Logo size={48} />
      </div>
    </div>
  )
}

export default Creditos
