import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { PixelCover } from '../../components/ui/PixelArt.jsx'
import Icon from '../../components/ui/Icon.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import RatingStars from '../../components/ui/RatingStars/RatingStars.jsx'
import { buscarProyecto, nombreMotor } from '../../data/proyectos.js'
import './Proyecto.css'

// Detalle de un proyecto (idéntico a Group 40.png en Figma)
function Proyecto() {
  const { id } = useParams()
  const proyecto = buscarProyecto(id)
  const [calificacion, setCalificacion] = useState(5)
  const [comentario, setComentario] = useState('')
  const [comentarios, setComentarios] = useState([])
  const [solicitado, setSolicitado] = useState(false)

  if (!proyecto) {
    return (
      <div className="page page--narrow">
        <h1>Proyecto no encontrado</h1>
        <Button to="/galeria">Volver a explorar</Button>
      </div>
    )
  }

  const enviarFeedback = (e) => {
    e.preventDefault()
    if (!comentario.trim()) return
    setComentarios([...comentarios, { texto: comentario.trim(), estrellas: calificacion }])
    setComentario('')
  }

  return (
    <div className="page proyecto">
      <div className="proyecto__media">
        {proyecto.portada ? (
          <img src={proyecto.portada} alt={proyecto.titulo} className="proyecto__cover-img" />
        ) : (
          <PixelCover seed={proyecto.id} palette={proyecto.paleta} className="proyecto__cover" />
        )}
        <button type="button" className="proyecto__play" aria-label="Reproducir tráiler">
          <svg className="proyecto__play-icon" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        </button>
      </div>

      <div className="proyecto__info">
        <div className="proyecto__title-pill">
          <h1 className="proyecto__title">{proyecto.titulo.toUpperCase()}</h1>
        </div>

        <div className="proyecto__sinopsis-box">
          <p>{proyecto.sinopsis.toUpperCase()}</p>
        </div>

        <div className="proyecto__cols">
          <section className="proyecto__ficha">
            <h2 className="proyecto__subheading">FICHA TÉCNICA</h2>
            <div className="proyecto__ficha-content">
              <p>MOTOR: {nombreMotor(proyecto.motor)} (URP)</p>
              <p>• ESTADO: {proyecto.version.toUpperCase()}</p>
              <p>• ROLES BUSCADOS:</p>
              <ul className="proyecto__roles">
                {proyecto.busca.map((r) => (
                  <li key={r}>[+] {r.toUpperCase()}</li>
                ))}
              </ul>
            </div>
            <Link to={`/perfil/${proyecto.autor}`} className="proyecto__autor-link">
              Ver perfil del creador (@{proyecto.autor})
            </Link>
          </section>

          <section className="proyecto__feedback">
            <h2 className="proyecto__subheading">EVALÚA EL PROTOTIPO (1 a 5 ⭐):</h2>
            <div className="proyecto__stars-row">
              <RatingStars value={calificacion} onChange={setCalificacion} />
            </div>

            <h2 className="proyecto__subheading proyecto__subheading--bugs">REPORTAR BUGS O SUGERENCIAS:</h2>
            <form onSubmit={enviarFeedback} className="proyecto__form-pill">
              <input
                id="feedback"
                type="text"
                placeholder="Escribe tu reporte…"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                aria-label="Reportar bugs o sugerencias"
              />
              <button type="submit" aria-label="Enviar reporte">
                <Icon name="search" size={16} />
              </button>
            </form>

            {comentarios.length > 0 && (
              <ul className="proyecto__comentarios">
                {comentarios.map((c, i) => (
                  <li key={i}>
                    {c.estrellas > 0 && <RatingStars value={c.estrellas} />}
                    <p>{c.texto}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {solicitado ? (
          <p className="proyecto__ok" role="status">
            ¡Solicitud enviada! @{proyecto.autor} recibirá tu postulación para unirte.
          </p>
        ) : (
          <button
            type="button"
            className="proyecto__btn-unirme"
            onClick={() => setSolicitado(true)}
          >
            SOLICITAR UNIRME
          </button>
        )}
      </div>
    </div>
  )
}

export default Proyecto
