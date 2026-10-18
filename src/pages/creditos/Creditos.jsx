import './Creditos.css'

const EQUIPO = [
  { nombre: 'JUAN SEBASTIÁN LÓPEZ', rol: 'LEAD GAME DEV & UX ARCHITECT' },
  { nombre: 'JUAN PABLO', rol: 'LEAD UI/UX & ART DIRECTOR' },
]

const REDES = [
  { icono: '💬', nombre: 'SERVIDOR DE DISCORD', url: 'https://discord.com' },
  { icono: '🎮', nombre: 'COMUNIDAD EN ITCH.IO', url: 'https://itch.io' },
  { icono: '🐦', nombre: 'TWITTER / X', url: 'https://x.com' },
  { icono: '💻', nombre: 'REPOSITORIO GITHUB', url: 'https://github.com/suzuya22/codespaces-blank' },
]

// Acerca de & contacto (idéntico a Group 42.png)
function Creditos() {
  return (
    <div className="page creditos">
      <div className="creditos__banner">
        <div className="creditos__banner-media">
          <img
            src="images/banners/auth-banner.png"
            alt="DevNet cielo pixelado"
            className="creditos__banner-img"
          />
        </div>
        <div className="creditos__banner-text">
          <p className="creditos__banner-title">ACERCA DE & CONTACTO</p>
        </div>
      </div>

      <section className="creditos__section">
        <h1 className="creditos__heading">MANIFIESTO</h1>
        <div className="creditos__box">
          <p>
            ”CREAMOS DEVNEST PARA CONECTAR CREADORES INDIE, TRANSFORMAR IDEAS EN PROYECTOS JUGABLES Y FOMENTAR EL FEEDBACK REAL
            ENTRE DESARROLLADORES Y ARTISTAS.”
          </p>
        </div>
      </section>

      <section className="creditos__section">
        <h2 className="creditos__heading">CRÉDITOS DEL EQUIPO FUNDADOR</h2>
        <ul className="creditos__equipo">
          {EQUIPO.map((p) => (
            <li key={p.nombre} className="creditos__equipo-item">
              <strong className="creditos__equipo-nombre">• {p.nombre}</strong>
              <span className="creditos__equipo-rol">{p.rol}</span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="creditos__divider" />

      <section className="creditos__section">
        <h2 className="creditos__heading">COMUNIDAD & REDES</h2>
        <ul className="creditos__redes">
          {REDES.map((r) => (
            <li key={r.nombre}>
              <a href={r.url} target="_blank" rel="noreferrer" className="creditos__red-link">
                [ {r.icono} {r.nombre} ↗ ]
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="creditos__logo">
        <img src="images/logos/dv-logo.png" alt="DevNet" className="creditos__logo-img" />
      </div>
    </div>
  )
}

export default Creditos
