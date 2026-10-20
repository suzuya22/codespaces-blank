import { useState } from 'react'
import { Link } from 'react-router'
import './Creditos.css'

const VALORES = [
  { icono: '🎮', titulo: 'Prototipos jugables', texto: 'Cada idea se prueba jugando: demos WebGL directamente en el navegador, sin instalar nada.' },
  { icono: '💬', titulo: 'Feedback real', texto: 'Reseñas y calificaciones de otros creadores para mejorar el control, el balance y el arte.' },
  { icono: '🤝', titulo: 'Equipos indie', texto: 'Conectamos programadores, artistas, músicos y diseñadores que buscan sumarse a un proyecto.' },
]

const EQUIPO = [
  { iniciales: 'JS', nombre: 'Juan Sebastián López', rol: 'Lead Game Dev & UX Architect' },
  { iniciales: 'JP', nombre: 'Juan Pablo', rol: 'Lead UI/UX & Art Director' },
]

const REDES = [
  { icono: '💬', nombre: 'Servidor de Discord', detalle: 'Charla con la comunidad', url: 'https://discord.com' },
  { icono: '🎮', nombre: 'Comunidad en itch.io', detalle: 'Builds y game jams', url: 'https://itch.io' },
  { icono: '🐦', nombre: 'Twitter / X', detalle: 'Novedades y devlogs', url: 'https://x.com' },
  { icono: '💻', nombre: 'Repositorio GitHub', detalle: 'Código del sitio', url: 'https://github.com/suzuya22/codespaces-blank' },
]

// Acerca de, manifiesto y contacto
function Creditos() {
  const [enviado, setEnviado] = useState(false)

  return (
    <div className="page creditos">
      {/* Banner */}
      <header className="creditos__banner">
        <img src="images/banners/auth-banner.png" alt="" className="creditos__banner-img" />
        <div className="creditos__banner-text">
          <p className="creditos__eyebrow">DevNet · Comunidad indie</p>
          <h1 className="creditos__banner-title">Acerca de &amp; contacto</h1>
        </div>
      </header>

      {/* Manifiesto */}
      <section className="creditos__manifiesto">
        <h2 className="creditos__heading">Manifiesto</h2>
        <blockquote className="creditos__quote">
          “Creamos DevNet para conectar creadores indie, transformar ideas en proyectos jugables y fomentar el feedback
          real entre desarrolladores y artistas.”
        </blockquote>
      </section>

      {/* Valores */}
      <section className="creditos__valores" aria-label="Qué hacemos">
        {VALORES.map((v) => (
          <article key={v.titulo} className="creditos__card creditos__valor">
            <span className="creditos__valor-icono" aria-hidden="true">
              {v.icono}
            </span>
            <h3>{v.titulo}</h3>
            <p>{v.texto}</p>
          </article>
        ))}
      </section>

      <div className="creditos__columns">
        {/* Equipo */}
        <section className="creditos__card creditos__equipo">
          <h2 className="creditos__heading">Equipo fundador</h2>
          <ul>
            {EQUIPO.map((p) => (
              <li key={p.nombre} className="creditos__persona">
                <span className="creditos__avatar" aria-hidden="true">
                  {p.iniciales}
                </span>
                <span>
                  <strong>{p.nombre}</strong>
                  <small>{p.rol}</small>
                </span>
              </li>
            ))}
          </ul>
          <p className="creditos__nota">
            Proyecto del curso Diseño adaptable · Universidad Pontificia Bolivariana, 2026-2.
          </p>
        </section>

        {/* Redes */}
        <section className="creditos__card creditos__redes-card">
          <h2 className="creditos__heading">Comunidad &amp; redes</h2>
          <ul className="creditos__redes">
            {REDES.map((r) => (
              <li key={r.nombre}>
                <a href={r.url} target="_blank" rel="noreferrer" className="creditos__red">
                  <span className="creditos__red-icono" aria-hidden="true">
                    {r.icono}
                  </span>
                  <span>
                    <strong>{r.nombre}</strong>
                    <small>{r.detalle}</small>
                  </span>
                  <span className="creditos__red-flecha" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Contacto */}
        <section className="creditos__card creditos__contacto">
          <h2 className="creditos__heading">Escríbenos</h2>
          {enviado ? (
            <p className="creditos__ok" role="status">
              ¡Gracias! Te responderemos pronto. Mientras tanto, <Link to="/galeria">explora los prototipos</Link>.
            </p>
          ) : (
            <form
              className="creditos__form"
              onSubmit={(e) => {
                e.preventDefault()
                setEnviado(true)
              }}
            >
              <label>
                Correo
                <input type="email" required placeholder="tu@correo.com" />
              </label>
              <label>
                Mensaje
                <textarea required rows={4} placeholder="Cuéntanos tu idea, duda o sugerencia" />
              </label>
              <button type="submit" className="creditos__btn">
                Enviar mensaje
              </button>
            </form>
          )}
        </section>
      </div>

      <div className="creditos__logo">
        <img src="images/logos/dv-logo.png" alt="DevNet" />
      </div>
    </div>
  )
}

export default Creditos
