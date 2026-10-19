import { Link, useParams } from 'react-router'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import { USUARIOS, PROYECTOS } from '../../data/proyectos.js'
import './Perfil.css'

function Perfil() {
  const { usuario } = useParams()
  // Por defecto se carga suzuya
  const perfil = USUARIOS[usuario] || USUARIOS.suzuya
  const proyectos = PROYECTOS.filter((p) => p.autor === perfil.usuario)

  return (
    <div className="page perfil">
      {/* Columna Izquierda: Tarjeta de perfil con banner superior y avatar */}
      <aside className="perfil__sidebar">
        <div className="perfil__card">
          <div className="perfil__banner-wrap">
            <img
              src={perfil.banner || 'images/banners/perfil-banner.png'}
              alt="Banner de perfil"
              className="perfil__banner-img"
            />
          </div>

          <div className="perfil__card-body">
            <div className="perfil__avatar-wrap">
              <img
                src={perfil.avatar || 'images/avatares/suzuya.png'}
                alt={perfil.nombre}
                className="perfil__avatar-img"
              />
            </div>

            <div className="perfil__user-info">
              <h1 className="perfil__user-handle">@{perfil.usuario.toUpperCase()}</h1>
              <p className="perfil__pronouns">{perfil.pronombres}</p>
              <p className="perfil__role">{perfil.rol}</p>

              <ul className="perfil__badges">
                {perfil.insignias.map((insignia, i) => (
                  <li key={i} className="perfil__badge-item">
                    <span className="perfil__star">★</span> {insignia}
                  </li>
                ))}
              </ul>

              <Link to="/mensajes" className="perfil__btn-mensaje">
                ENVIAR MENSAJE
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Columna Derecha: Sobre mí, Habilidades y Proyectos Publicados */}
      <main className="perfil__main">
        <section className="perfil__box">
          <h2 className="perfil__box-title">SOBRE MÍ</h2>
          <p className="perfil__box-text">{perfil.sobreMi}</p>
        </section>

        <section className="perfil__box">
          <h2 className="perfil__box-title">HABILIDADES</h2>
          <div className="perfil__skills-row">
            {perfil.habilidades.map((h) => (
              <span key={h} className="perfil__skill-chip">
                {h}
              </span>
            ))}
          </div>
        </section>

        <section className="perfil__projects-section">
          <h2 className="perfil__projects-heading">PROYECTOS PUBLICADOS</h2>
          <div className="perfil__projects-grid">
            {proyectos.map((p) => (
              <ProjectCard key={p.id} proyecto={p} variant="grande" />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Perfil
