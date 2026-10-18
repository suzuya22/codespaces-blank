import { useParams } from 'react-router'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import { USUARIOS, PROYECTOS } from '../../data/proyectos.js'
import './Perfil.css'

// Perfil de usuario (idéntico a Group 39.png en Figma)
function Perfil() {
  const { usuario } = useParams()
  // Default to suzuya if no parameter or matching user
  const perfil = USUARIOS[usuario] || USUARIOS.suzuya

  const proyectos = PROYECTOS.filter((p) => p.autor === perfil.usuario)

  return (
    <div className="page perfil">
      <div className="perfil__hero">
        <div className="perfil__banner-wrap">
          <img
            src={perfil.banner || 'images/banners/perfil-banner.png'}
            alt="Banner de perfil"
            className="perfil__banner-img"
          />
        </div>

        <div className="perfil__header-body">
          <div className="perfil__avatar-wrap">
            <img
              src={perfil.avatar || 'images/avatares/suzuya.png'}
              alt={perfil.nombre}
              className="perfil__avatar-img"
            />
          </div>

          <div className="perfil__user-details">
            <h1 className="perfil__user-handle">@{perfil.usuario.toUpperCase()}</h1>
            <p className="perfil__pronouns">{perfil.pronombres}</p>
            <p className="perfil__role">{perfil.rol}</p>

            <div className="perfil__socials">
              <img
                src="images/logos/redes-sociales.png"
                alt="Redes sociales: WhatsApp, Facebook, Instagram, YouTube, X, TikTok"
                className="perfil__socials-img"
              />
            </div>

            <ul className="perfil__badges">
              {perfil.insignias.map((insignia, index) => {
                const icon = index === 0 ? '🏆' : index === 1 ? '🛠' : '🤝'
                return (
                  <li key={insignia} className="perfil__badge-item">
                    <span className="perfil__badge-icon">{icon}</span> {insignia.toUpperCase()}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      <hr className="perfil__divider" />

      <section className="perfil__section">
        <h2 className="perfil__heading">SOBRE MI</h2>
        <div className="perfil__box">
          <p>{perfil.sobreMi.toUpperCase()}</p>
        </div>
      </section>

      <section className="perfil__section">
        <h2 className="perfil__heading">HABILIDADES</h2>
        <div className="perfil__skills-row">
          {perfil.habilidades.map((h) => (
            <span key={h} className="perfil__skill-chip">
              [{h.toUpperCase()}]
            </span>
          ))}
        </div>
      </section>

      <section className="perfil__section perfil__section--projects">
        <div className="perfil__projects-pill">
          <h2>PROYECTOS PUBLICADOS</h2>
        </div>

        <div className="perfil__projects-list">
          {proyectos.map((p) => (
            <ProjectCard key={p.id} proyecto={p} variant="grande" />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Perfil
