import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router'
import { PixelCover } from '../../components/ui/PixelArt.jsx'
import Icon from '../../components/ui/Icon.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import RatingStars from '../../components/ui/RatingStars/RatingStars.jsx'
import { buscarProyecto, nombreMotor } from '../../data/proyectos.js'
import './Proyecto.css'

// Detalle de un proyecto con soporte para prototipos WebGL interactivos
function Proyecto() {
  const { id } = useParams()
  const proyecto = buscarProyecto(id)
  const [calificacion, setCalificacion] = useState(5)
  const [comentario, setComentario] = useState('')
  const [comentarios, setComentarios] = useState([])
  const [solicitado, setSolicitado] = useState(false)
  const [jugando, setJugando] = useState(false)
  const [mensajeSinDemo, setMensajeSinDemo] = useState(false)
  const playerContainerRef = useRef(null)

  if (!proyecto) {
    return (
      <div className="page page--narrow">
        <h1>Proyecto no encontrado</h1>
        <Button to="/galeria">Volver a explorar</Button>
      </div>
    )
  }

  const tieneDemo = Boolean(proyecto.juegoUrl)

  const handlePlayClick = () => {
    if (tieneDemo) {
      setJugando(true)
      setMensajeSinDemo(false)
    } else {
      setMensajeSinDemo(true)
      setTimeout(() => setMensajeSinDemo(false), 4500)
    }
  }

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.warn('Error al activar pantalla completa:', err)
      })
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Error al salir de pantalla completa:', err)
      })
    }
  }

  const enviarFeedback = (e) => {
    e.preventDefault()
    if (!comentario.trim()) return
    setComentarios([...comentarios, { texto: comentario.trim(), estrellas: calificacion }])
    setComentario('')
  }

  return (
    <div className="page proyecto">
      {jugando && tieneDemo ? (
        <div className="proyecto__player" ref={playerContainerRef}>
          <div className="proyecto__player-bar">
            <button
              type="button"
              className="proyecto__player-btn proyecto__player-btn--close"
              onClick={() => setJugando(false)}
              aria-label="Salir del juego"
            >
              ✕ Cerrar juego
            </button>
            <span className="proyecto__player-title">
              🎮 {proyecto.titulo.toUpperCase()} · PROTOTIPO {proyecto.version.toUpperCase()}
            </span>
            <button
              type="button"
              className="proyecto__player-btn proyecto__player-btn--fs"
              onClick={toggleFullscreen}
              aria-label="Pantalla completa"
            >
              ⛶ Pantalla completa
            </button>
          </div>

          <div className="proyecto__phone-wrapper">
            <div className={`proyecto__phone-bezel ${proyecto.formato === 'vertical' ? 'proyecto__phone-bezel--vertical' : ''}`}>
              <div className="proyecto__phone-notch">
                <span className="proyecto__phone-camera" />
              </div>
              <iframe
                src={proyecto.juegoUrl}
                title={`Prototipo de ${proyecto.titulo}`}
                className="proyecto__game-frame"
                allow="fullscreen; autoplay; gamepad"
              />
            </div>
          </div>

          <p className="proyecto__player-hint">
            🖱️ En PC haz clic y arrastra con el ratón · 📱 En móvil y tableta funciona con toque táctil directo
          </p>
        </div>
      ) : (
        <div className="proyecto__media">
          {proyecto.portada ? (
            <img src={proyecto.portada} alt={proyecto.titulo} className="proyecto__cover-img" />
          ) : (
            <PixelCover seed={proyecto.id} palette={proyecto.paleta} className="proyecto__cover" />
          )}

          <button
            type="button"
            className={`proyecto__play ${tieneDemo ? 'proyecto__play--activo' : 'proyecto__play--inactivo'}`}
            onClick={handlePlayClick}
            aria-label={tieneDemo ? `Jugar prototipo de ${proyecto.titulo}` : 'Prototipo no disponible'}
          >
            <svg className="proyecto__play-icon" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,3 20,12 6,21" />
            </svg>
            {tieneDemo && <span className="proyecto__play-badge">¡PROBAR AHORA!</span>}
          </button>

          {mensajeSinDemo && (
            <div className="proyecto__no-demo-toast" role="alert">
              🔒 Este proyecto aún no cuenta con una build web pública. ¡Solo <strong>Bit Scape</strong> tiene prototipo jugable activo!
            </div>
          )}
        </div>
      )}

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
