import { useParams } from 'react-router'
import { PixelAvatar, PixelSky } from '../../components/ui/PixelArt.jsx'
import Tag from '../../components/ui/Tag/Tag.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import { USUARIOS, PROYECTOS } from '../../data/proyectos.js'
import './Perfil.css'

// Perfil de usuario (ruta dinámica /perfil/:usuario)
function Perfil() {
  const { usuario } = useParams()
  const perfil = USUARIOS[usuario]

  if (!perfil) {
    return (
      <div className="page page--narrow">
        <h1>Usuario no encontrado</h1>
        <Button to="/galeria">Volver a explorar</Button>
      </div>
    )
  }

  const proyectos = PROYECTOS.filter((p) => p.autor === perfil.usuario)

  return (
    <div className="page perfil">
      <aside className="perfil__card">
        <div className="perfil__banner">
          <PixelSky />
        </div>
        <div className="perfil__head">
          <PixelAvatar seed={perfil.usuario} size={96} className="perfil__avatar" />
          <div>
            <h1 className="perfil__user">@{perfil.usuario}</h1>
            <p className="muted">{perfil.pronombres}</p>
            <p>{perfil.rol}</p>
          </div>
        </div>
        <ul className="perfil__insignias">
          {perfil.insignias.map((i) => (
            <li key={i}>★ {i}</li>
          ))}
        </ul>
        <Button to="/mensajes" variant="ghost" full>
          Enviar mensaje
        </Button>
      </aside>

      <div className="perfil__content">
        <section className="card">
          <h2>Sobre mí</h2>
          <p>{perfil.sobreMi}</p>
        </section>
        <section className="card">
          <h2>Habilidades</h2>
          <div className="perfil__skills">
            {perfil.habilidades.map((h) => (
              <Tag key={h}>{h}</Tag>
            ))}
          </div>
        </section>
        <section>
          <h2 className="perfil__subtitle">Proyectos publicados</h2>
          {proyectos.length ? (
            <div className="perfil__grid">
              {proyectos.map((p) => (
                <ProjectCard key={p.id} proyecto={p} />
              ))}
            </div>
          ) : (
            <p className="muted">Aún no ha publicado proyectos.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default Perfil
