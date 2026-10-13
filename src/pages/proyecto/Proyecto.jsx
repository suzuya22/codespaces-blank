import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { PixelCover, PixelAvatar } from '../../components/ui/PixelArt.jsx'
import Icon from '../../components/ui/Icon.jsx'
import Tag from '../../components/ui/Tag/Tag.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import RatingStars from '../../components/ui/RatingStars/RatingStars.jsx'
import { buscarProyecto, nombreMotor } from '../../data/proyectos.js'
import './Proyecto.css'

// Detalle de un proyecto (ruta dinámica /proyecto/:id)
function Proyecto() {
  const { id } = useParams()
  const proyecto = buscarProyecto(id)
  const [calificacion, setCalificacion] = useState(0)
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
        <PixelCover seed={proyecto.id} palette={proyecto.paleta} className="proyecto__cover" label={`Portada de ${proyecto.titulo}`} />
        <button type="button" className="proyecto__play" aria-label="Reproducir tráiler">
          <Icon name="play" size={40} filled />
        </button>
      </div>

      <div className="proyecto__info">
        <h1 className="proyecto__title">{proyecto.titulo}</h1>
        <Link to={`/perfil/${proyecto.autor}`} className="proyecto__autor">
          <PixelAvatar seed={proyecto.autor} size={28} /> @{proyecto.autor}
        </Link>
        <div className="proyecto__tags">
          {proyecto.generos.map((g) => (
            <Tag key={g}>{g}</Tag>
          ))}
        </div>
        <p className="card proyecto__sinopsis">{proyecto.sinopsis}</p>

        <div className="proyecto__cols">
          <section className="proyecto__ficha">
            <h2>Ficha técnica</h2>
            <dl>
              <dt>Motor</dt>
              <dd>{nombreMotor(proyecto.motor)}</dd>
              <dt>Estado</dt>
              <dd>{proyecto.version}</dd>
              <dt>Se busca</dt>
              <dd>{proyecto.busca.join(', ')}</dd>
              <dt>Valoración</dt>
              <dd>
                <RatingStars value={proyecto.rating} /> {proyecto.rating}
              </dd>
            </dl>
          </section>

          <section className="proyecto__feedback">
            <h2>Evalúa el prototipo</h2>
            <RatingStars value={calificacion} onChange={setCalificacion} />
            <form onSubmit={enviarFeedback} className="proyecto__form">
              <label htmlFor="feedback" className="sr-only">
                Reportar bugs o sugerencias
              </label>
              <textarea
                id="feedback"
                placeholder="Reportar bugs o sugerencias…"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
              <Button type="submit" variant="ghost">
                Enviar feedback
              </Button>
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
            ¡Solicitud enviada! @{proyecto.autor} recibirá tu mensaje.
          </p>
        ) : (
          <Button full onClick={() => setSolicitado(true)}>
            Solicitar unirme
          </Button>
        )}
      </div>
    </div>
  )
}

export default Proyecto
