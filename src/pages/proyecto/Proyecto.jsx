import { Suspense, useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PixelCover } from '../../components/ui/PixelArt.jsx'
import Icon from '../../components/ui/Icon.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import RatingStars from '../../components/ui/RatingStars/RatingStars.jsx'
import { nombreMotor, USUARIOS } from '../../data/proyectos.js'
import { useProyecto, useProyectosCargados, agregarResena, eliminarProyecto } from '../../data/store.js'
import { Visor3D } from '../../components/ui/Visor3D/index.js'
import Avatar from '../../components/ui/Avatar/Avatar.jsx'
import { useAuth } from '../../auth/AuthContext.jsx'
import { servicio, formatoPeso, mensajeError } from '../../servicios/index.js'
import './Proyecto.css'

const fechaCorta = (ms) => (ms ? new Date(ms).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : '')

// Perfil del autor: los de ejemplo vienen en USUARIOS; los reales se leen de la base de datos
function usePerfilAutor(usuario) {
  const [remoto, setRemoto] = useState(null)
  useEffect(() => {
    if (!usuario || USUARIOS[usuario]) return
    let vivo = true
    servicio
      .obtenerPerfil(usuario)
      .then((p) => vivo && setRemoto(p))
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [usuario])
  return USUARIOS[usuario] ?? (remoto?.usuario === usuario ? remoto : null)
}

function Proyecto() {
  const { id } = useParams()
  const proyecto = useProyecto(id)
  const cargado = useProyectosCargados()
  const navigate = useNavigate()
  const { usuario, listo } = useAuth()
  const [vista, setVista] = useState('modelo') // modelo | portada (cuando hay modelo 3D)
  const [enviandoResena, setEnviandoResena] = useState(false)
  const [errorResena, setErrorResena] = useState('')
  const [confirmarBorrado, setConfirmarBorrado] = useState(false)
  const [calificacion, setCalificacion] = useState(5)
  const [comentario, setComentario] = useState('')
  const [recienActualizado, setRecienActualizado] = useState(false)
  const [solicitado, setSolicitado] = useState(false)
  const [jugando, setJugando] = useState(false)
  const [mensajeSinDemo, setMensajeSinDemo] = useState(false)
  const playerContainerRef = useRef(null)
  const perfilAutor = usePerfilAutor(proyecto?.autor)

  const tieneDemo = Boolean(proyecto?.juegoUrl)
  const puedePantallaCompleta = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)

  // Al cambiar de proyecto se cierra el juego abierto
  useEffect(() => {
    setJugando(false)
  }, [id])

  // Bloqueo de scroll y ajuste de interfaz en móvil cuando se está jugando tipo APK
  useEffect(() => {
    if (jugando && tieneDemo) {
      document.body.classList.add('body--game-active')
    } else {
      document.body.classList.remove('body--game-active')
    }
    return () => {
      document.body.classList.remove('body--game-active')
    }
  }, [jugando, tieneDemo])

  if (!proyecto) {
    if (!cargado) return <div className="page page--narrow muted">Cargando proyecto…</div>
    return (
      <div className="page page--narrow">
        <h1>Proyecto no encontrado</h1>
        <Button to="/galeria">Volver a explorar</Button>
      </div>
    )
  }

  const handlePlayClick = () => {
    if (!tieneDemo && proyecto.enlaceJuego) {
      window.open(proyecto.enlaceJuego, '_blank', 'noopener')
      return
    }
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

  const reloadGame = () => {
    const iframe = playerContainerRef.current?.querySelector('iframe')
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  // Estadísticas globales: el almacén ya combina datos base + reseñas de la comunidad
  const comentarios = proyecto.resenas
  const totalFeedbacks = proyecto.feedbacks
  const ratingActual = totalFeedbacks ? proyecto.rating.toFixed(1) : '—'

  const enviarFeedback = async (e) => {
    e.preventDefault()
    if (!comentario.trim()) return
    setErrorResena('')
    setEnviandoResena(true)
    try {
      await agregarResena(proyecto.id, { texto: comentario.trim(), estrellas: calificacion }, usuario)
      setComentario('')
      setRecienActualizado(true)
      setTimeout(() => setRecienActualizado(false), 1000)
    } catch (err) {
      setErrorResena(mensajeError(err))
    } finally {
      setEnviandoResena(false)
    }
  }

  const esDueno = listo && proyecto.autorUid && proyecto.autorUid === usuario.uid
  const tieneModelo = Boolean(proyecto.modelo?.url)
  const verModelo = tieneModelo && vista === 'modelo'
  const borrar = async () => {
    await eliminarProyecto(proyecto.id)
    navigate(`/perfil/${usuario.usuario}`)
  }

  const claseValor = recienActualizado ? 'proyecto__spec-value--updated' : undefined

  return (
    <div className="page proyecto">
      {/* 1. Breadcrumbs & Header Bar */}
      <div className="proyecto__breadcrumb-bar">
        <div className="proyecto__breadcrumb">
          <Link to="/">Inicio</Link> &gt; <Link to="/galeria">Explorar</Link> &gt; <span>{proyecto.titulo}</span>
        </div>
        <div className="proyecto__quick-actions">
          <button type="button" className="proyecto__action-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            🔗 Compartir
          </button>
          <button type="button" className="proyecto__action-btn">
            ⭐ Guardar
          </button>
        </div>
      </div>

      {/* 2. Distribución en 2 Columnas Desktop (Main Stage Izquierda + Ficha Sticky Derecha) */}
      <div className="proyecto__desktop-layout">
        {/* Columna Principal (Área de Juego + Sinopsis + Feedback) */}
        <div className="proyecto__main-stage">
          {/* Título y Badges */}
          <div className="proyecto__title-header">
            <h1 className="proyecto__title">{proyecto.titulo.toUpperCase()}</h1>
            <div className="proyecto__badge-row">
              <span className="proyecto__chip-engine">{nombreMotor(proyecto.motor)}</span>
              <span className="proyecto__chip-ver">{proyecto.version.toUpperCase()}</span>
              {tieneDemo && <span className="proyecto__chip-demo">● DEMO PLAYTEST</span>}
            </div>
          </div>

          {/* Selector modelo 3D / portada */}
          {tieneModelo && !jugando && (
            <div className="proyecto__vista-tabs" role="tablist" aria-label="Vista del proyecto">
              <button type="button" role="tab" aria-selected={vista === 'modelo'} onClick={() => setVista('modelo')}>
                ◆ Modelo 3D
              </button>
              <button type="button" role="tab" aria-selected={vista === 'portada'} onClick={() => setVista('portada')}>
                Portada
              </button>
              <span className="proyecto__vista-info">
                {proyecto.modelo.formato?.toUpperCase()}
                {proyecto.modelo.bytes ? ` · ${formatoPeso(proyecto.modelo.bytes)}` : ''}
              </span>
            </div>
          )}

          {/* WebGL Player o Portada */}
          <div className="proyecto__viewport-container">
            {jugando && tieneDemo ? (
              <div className="proyecto__player" ref={playerContainerRef}>
                <div className="proyecto__player-bar">
                  <span className="proyecto__player-title">
                    🎮 {proyecto.titulo.toUpperCase()} · BUILD {proyecto.version.toUpperCase()}
                  </span>
                  <div className="proyecto__player-controls">
                    <button type="button" className="proyecto__player-btn" onClick={reloadGame} title="Reiniciar juego">
                      ⟳ Reiniciar
                    </button>
                    {puedePantallaCompleta && (
                      <button
                        type="button"
                        className="proyecto__player-btn proyecto__player-btn--fs"
                        onClick={toggleFullscreen}
                        title="Pantalla completa"
                      >
                        ⛶ Pantalla completa
                      </button>
                    )}
                    <button
                      type="button"
                      className="proyecto__player-btn proyecto__player-btn--close"
                      onClick={() => setJugando(false)}
                      title="Cerrar juego y volver"
                    >
                      ✕ Salir
                    </button>
                  </div>
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
              verModelo ? (
              <div className="proyecto__media proyecto__media--3d">
                <Suspense fallback={<p className="proyecto__cargando-3d">Cargando visor 3D…</p>}>
                  <Visor3D url={proyecto.modelo.url} formato={proyecto.modelo.formato} nombre={proyecto.titulo} />
                </Suspense>
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
                  {tieneDemo ? (
                    <span className="proyecto__play-badge">¡Iniciar playtest (WebGL)!</span>
                  ) : proyecto.enlaceJuego ? (
                    <span className="proyecto__play-badge">Jugar la build ↗</span>
                  ) : (
                    <span className="proyecto__play-badge">Demo próximamente</span>
                  )}
                </button>

                {mensajeSinDemo && (
                  <div className="proyecto__no-demo-toast" role="alert">
                    🔒 Este proyecto aún no cuenta con una build jugable pública.
                  </div>
                )}
              </div>
              )
            )}
          </div>

          {/* Sinopsis & Objetivos del Playtest */}
          <div className="proyecto__sinopsis-card">
            <h2 className="proyecto__card-heading">SINOPSIS &amp; OBJETIVOS DEL PLAYTEST</h2>
            <p className="proyecto__sinopsis-text">{proyecto.sinopsis}</p>
            <div className="proyecto__genres-row">
              {proyecto.generos.map((g) => (
                <span key={g} className="proyecto__genre-tag">[ + {g} ]</span>
              ))}
            </div>
          </div>

          {/* Módulo de Feedback y Calificación */}
          <section className="proyecto__feedback-card">
            <div className="proyecto__feedback-header">
              <h2 className="proyecto__card-heading">EVALÚA EL PROTOTIPO (PLAYTEST FEEDBACK)</h2>
              <div className="proyecto__stars-wrap">
                <span className="proyecto__stars-label">Calificación:</span>
                <RatingStars value={calificacion} onChange={setCalificacion} />
              </div>
            </div>

            {!listo ? (
              <div className="proyecto__feedback-gate">
                <p>Inicia sesión para calificar y dejar feedback con tu nombre de usuario.</p>
                <Button to={`/login?volver=/proyecto/${proyecto.id}`}>Iniciar sesión</Button>
                <Button to={`/registro?volver=/proyecto/${proyecto.id}`} variant="ghost">
                  Crear cuenta
                </Button>
              </div>
            ) : (
            <form onSubmit={enviarFeedback} className="proyecto__feedback-form">
              <div className="proyecto__field-group">
                <label htmlFor="comentario-input" className="proyecto__label">
                  ¿Qué te pareció el control, el balance o encontraste algún bug?
                </label>
                <textarea
                  id="comentario-input"
                  className="proyecto__textarea"
                  placeholder="Describe tu experiencia, bugs encontrados, rendimiento o sugerencias..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              {errorResena && (
                <p className="proyecto__error" role="alert">
                  {errorResena}
                </p>
              )}
              <div className="proyecto__form-actions">
                <span className="proyecto__como">Comentas como @{usuario.usuario}</span>
                <button type="submit" className="proyecto__btn-submit" disabled={enviandoResena}>
                  {enviandoResena ? 'Enviando…' : 'Enviar feedback al desarrollador'}
                </button>
              </div>
            </form>
            )}

            {comentarios.length > 0 && (
              <ul className="proyecto__comentarios-list" aria-live="polite">
                {comentarios.map((c, i) => (
                  <li key={c.id ?? c.fecha ?? i} className="proyecto__comentario-item">
                    <div className="proyecto__comentario-head">
                      {c.autor ? (
                        <Link to={`/perfil/${c.autor}`} className="proyecto__comentario-autor">
                          <Avatar usuario={c.autor} size={24} />@{c.autor}
                        </Link>
                      ) : (
                        <span className="proyecto__comentario-autor">Anónimo</span>
                      )}
                      <RatingStars value={c.estrellas} />
                      {c.fecha && <time className="proyecto__comentario-fecha">{fechaCorta(c.fecha)}</time>}
                    </div>
                    <p>{c.texto}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Columna Lateral Sticky (Ficha Técnica + Reclutamiento + Creador) */}
        <aside className="proyecto__sidebar-specs">
          {/* Tarjeta 1: Ficha Técnica */}
          <div className="proyecto__spec-card">
            <h3 className="proyecto__spec-title">FICHA TÉCNICA</h3>
            <ul className="proyecto__spec-list">
              <li>
                <span className="proyecto__spec-key">Motor:</span>
                <strong>
                  {nombreMotor(proyecto.motor)}
                  {proyecto.motor === 'unity' ? ' (URP)' : ''}
                </strong>
              </li>
              <li>
                <span className="proyecto__spec-key">Estado:</span>
                <span className="proyecto__status-tag">{proyecto.version.toUpperCase()}</span>
              </li>
              <li>
                <span className="proyecto__spec-key">Plataforma:</span>
                <span>WebGL / PC Windows</span>
              </li>
              <li>
                <span className="proyecto__spec-key">Rating de la comunidad:</span>
                <span key={`r-${totalFeedbacks}`} className={claseValor}>
                  ⭐ {ratingActual} / 5
                </span>
              </li>
              <li>
                <span className="proyecto__spec-key">Feedbacks recibidos:</span>
                <span key={`f-${totalFeedbacks}`} className={claseValor}>
                  💬 {totalFeedbacks}
                </span>
              </li>
            </ul>
          </div>

          {/* Tarjeta 2: Roles Buscados / Reclutamiento */}
          <div className="proyecto__spec-card proyecto__spec-card--recruit">
            <div className="proyecto__recruit-header">
              <span className="proyecto__live-pulse"></span>
              <h3 className="proyecto__spec-title">ROLES BUSCADOS (EQUIPO)</h3>
            </div>
            <p className="proyecto__recruit-desc">
              El creador está buscando talentos para sumar al proyecto y postular a convocatorias:
            </p>
            <ul className="proyecto__roles-list">
              {proyecto.busca.map((r) => (
                <li key={r} className="proyecto__role-chip">[+] {r.toUpperCase()}</li>
              ))}
            </ul>

            {solicitado ? (
              <div className="proyecto__ok-banner">
                ✓ ¡Solicitud enviada a @{proyecto.autor}!
              </div>
            ) : (
              <button
                type="button"
                className="proyecto__btn-unirme"
                onClick={() => setSolicitado(true)}
              >
                🤝 Solicitar unirme al equipo
              </button>
            )}
          </div>

          {/* Tarjeta 3: Creador del Proyecto */}
          <div className="proyecto__spec-card">
            <h4 className="proyecto__creator-heading">CREADOR DEL PROYECTO</h4>
            <div className="proyecto__creator-profile">
              <Avatar perfil={perfilAutor ?? undefined} usuario={proyecto.autor} size={44} className="proyecto__creator-avatar" />
              <div>
                <h4 className="proyecto__creator-name">@{proyecto.autor}</h4>
                <p className="proyecto__creator-role">{perfilAutor?.rol ?? 'Creador indie'}</p>
              </div>
            </div>
            <Link to={`/perfil/${proyecto.autor}`} className="proyecto__creator-link">
              Ver perfil completo y proyectos ↗
            </Link>
            {proyecto.creadoEn && <p className="proyecto__publicado">Publicado el {fechaCorta(proyecto.creadoEn)}</p>}
          </div>

          {esDueno && (
            <div className="proyecto__spec-card proyecto__spec-card--dueno">
              <h4 className="proyecto__creator-heading">TU PROYECTO</h4>
              {confirmarBorrado ? (
                <>
                  <p className="proyecto__recruit-desc">¿Seguro? Se borrará para todas las cuentas.</p>
                  <div className="proyecto__dueno-acciones">
                    <button type="button" className="proyecto__btn-borrar" onClick={borrar}>
                      Sí, eliminar
                    </button>
                    <button type="button" className="proyecto__action-btn" onClick={() => setConfirmarBorrado(false)}>
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" className="proyecto__btn-borrar" onClick={() => setConfirmarBorrado(true)}>
                  Eliminar proyecto
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default Proyecto
