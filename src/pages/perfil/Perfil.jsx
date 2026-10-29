import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import Avatar from '../../components/ui/Avatar/Avatar.jsx'
import RatingStars from '../../components/ui/RatingStars/RatingStars.jsx'
import { USUARIOS } from '../../data/proyectos.js'
import { useProyectos } from '../../data/store.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { servicio, subirArchivo, validarArchivo, mensajeError, normalizarUsuario } from '../../servicios/index.js'
import './Perfil.css'

const ROLES = ['Programador', 'Artista 2D', 'Artista 3D', 'Diseñador de juegos', 'Músico / Sonido', 'Escritor / Narrativa', 'Playtester', 'Creador indie']

// Carga el perfil: los de ejemplo vienen en USUARIOS, los reales de la base de datos
function usePerfil(nombre, propio) {
  const [estado, setEstado] = useState({ nombre: null, perfil: null })
  useEffect(() => {
    if (!nombre || propio || USUARIOS[nombre]) return
    let vivo = true
    servicio
      .obtenerPerfil(nombre)
      .then((perfil) => vivo && setEstado({ nombre, perfil }))
      .catch(() => vivo && setEstado({ nombre, perfil: null }))
    return () => {
      vivo = false
    }
  }, [nombre, propio])
  if (propio) return { perfil: propio, cargando: false }
  if (USUARIOS[nombre]) return { perfil: USUARIOS[nombre], cargando: false }
  return { perfil: estado.nombre === nombre ? estado.perfil : null, cargando: estado.nombre !== nombre }
}

// Formulario para editar el perfil propio
function EditarPerfil({ perfil, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(perfil.nombre ?? '')
  const [rol, setRol] = useState(perfil.rol ?? '')
  const [sobreMi, setSobreMi] = useState(perfil.sobreMi ?? '')
  const [habilidades, setHabilidades] = useState((perfil.habilidades ?? []).join(', '))
  const [itch, setItch] = useState(perfil.enlaces?.itch ?? '')
  const [github, setGithub] = useState(perfil.enlaces?.github ?? '')
  const [archivoAvatar, setArchivoAvatar] = useState(null)
  const [vistaAvatar, setVistaAvatar] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!archivoAvatar) return setVistaAvatar(null)
    const url = URL.createObjectURL(archivoAvatar)
    setVistaAvatar(url)
    return () => URL.revokeObjectURL(url)
  }, [archivoAvatar])

  const elegirAvatar = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      validarArchivo(file, 'imagen')
      setError('')
      setArchivoAvatar(file)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      const cambios = {
        nombre: nombre.trim().slice(0, 40) || perfil.usuario,
        rol: rol.trim().slice(0, 40) || 'Creador indie',
        sobreMi: sobreMi.trim().slice(0, 500),
        habilidades: habilidades
          .split(',')
          .map((h) => h.trim())
          .filter(Boolean)
          .slice(0, 12)
          .map((h) => h.slice(0, 24)),
        enlaces: { itch: itch.trim().slice(0, 200), github: github.trim().slice(0, 200) },
      }
      if (archivoAvatar) {
        const subido = await subirArchivo(archivoAvatar, { tipo: 'imagen', carpeta: 'devnet/avatares' })
        cambios.avatar = subido.url
      }
      await onGuardar(cambios)
    } catch (err) {
      setError(mensajeError(err))
      setGuardando(false)
    }
  }

  return (
    <form className="perfil__editar card" onSubmit={guardar}>
      <h2 className="perfil__box-title">EDITAR PERFIL</h2>

      <div className="perfil__editar-avatar">
        {vistaAvatar ? (
          <img src={vistaAvatar} alt="Nueva foto de perfil" width={72} height={72} />
        ) : (
          <Avatar perfil={perfil} size={72} />
        )}
        <label className="perfil__action-btn perfil__action-btn--edit">
          Cambiar foto
          <input type="file" accept="image/*" onChange={elegirAvatar} hidden />
        </label>
      </div>

      <label className="perfil__campo">
        Nombre visible
        <input value={nombre} maxLength={40} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <label className="perfil__campo">
        Rol
        <input value={rol} maxLength={40} list="perfil-roles" onChange={(e) => setRol(e.target.value)} />
        <datalist id="perfil-roles">
          {ROLES.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </label>
      <label className="perfil__campo">
        Sobre mí
        <textarea rows={4} value={sobreMi} maxLength={500} onChange={(e) => setSobreMi(e.target.value)} />
      </label>
      <label className="perfil__campo">
        Habilidades (separadas por comas)
        <input value={habilidades} onChange={(e) => setHabilidades(e.target.value)} placeholder="Unity, C#, Blender" />
      </label>
      <div className="perfil__campo-fila">
        <label className="perfil__campo">
          Itch.io
          <input value={itch} onChange={(e) => setItch(e.target.value)} placeholder="tu-usuario.itch.io" />
        </label>
        <label className="perfil__campo">
          GitHub
          <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/tu-usuario" />
        </label>
      </div>

      {error && (
        <p className="perfil__error" role="alert">
          {error}
        </p>
      )}
      <div className="perfil__editar-acciones">
        <button type="button" className="perfil__action-btn perfil__action-btn--msg" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="perfil__action-btn perfil__action-btn--edit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

const enlaceExterno = (texto) => (/^https?:\/\//.test(texto) ? texto : `https://${texto}`)

function Perfil() {
  const params = useParams()
  const { usuario: sesion, listo, cargando: cargandoSesion, actualizarPerfil } = useAuth()
  const nombre = params.usuario ? normalizarUsuario(params.usuario) || params.usuario : sesion?.usuario
  const esPropio = listo && nombre === sesion.usuario
  const { perfil, cargando } = usePerfil(nombre, esPropio ? sesion : null)
  const todos = useProyectos()
  const [activeTab, setActiveTab] = useState('proyectos')
  const [editando, setEditando] = useState(false)

  // /perfil sin sesión: invitar a entrar
  if (!params.usuario && !cargandoSesion && !listo) {
    return (
      <div className="page page--narrow perfil__gate">
        <h1>Tu perfil</h1>
        <p className="muted">Inicia sesión para ver tu perfil, tus proyectos publicados y los feedbacks que has dado.</p>
        <Button to="/login?volver=/perfil" full>
          Iniciar sesión
        </Button>
        <Button to="/registro?volver=/perfil" variant="ghost" full>
          Crear cuenta
        </Button>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="page page--narrow">
        {cargando || cargandoSesion ? (
          <p className="muted">Cargando perfil…</p>
        ) : (
          <>
            <h1>Usuario no encontrado</h1>
            <p className="muted">No existe ninguna cuenta con el nombre @{nombre}.</p>
            <Button to="/galeria">Volver a explorar</Button>
          </>
        )}
      </div>
    )
  }

  const proyectos = todos.filter((p) => p.autor === perfil.usuario)
  const feedbacks = todos
    .flatMap((p) => (p.resenas ?? []).filter((r) => r.autor === perfil.usuario).map((r) => ({ ...r, proyecto: p })))
    .sort((a, b) => (b.fecha ?? 0) - (a.fecha ?? 0))
  const habilidades = perfil.habilidades ?? []
  const insignias = perfil.insignias ?? []
  const enlaces = perfil.enlaces ?? {}

  const guardar = async (cambios) => {
    await actualizarPerfil(cambios)
    setEditando(false)
  }

  return (
    <div className="page perfil">
      {/* 1. Banner panorámico */}
      <div className="perfil__cover-wrapper">
        <img src={perfil.banner || 'images/banners/perfil-banner.png'} alt="" className="perfil__cover-img" />
      </div>

      {/* 2. Cabecera de identidad */}
      <div className="perfil__identity-header">
        <div className="perfil__identity-left">
          <div className="perfil__avatar-container">
            <Avatar perfil={perfil} size={135} className="perfil__avatar-img" />
          </div>

          <div className="perfil__names-block">
            <div className="perfil__handle-row">
              <h1 className="perfil__handle">@{perfil.usuario.toUpperCase()}</h1>
              {perfil.pronombres && <span className="perfil__pronouns">{perfil.pronombres}</span>}
            </div>
            <p className="perfil__role-title">
              {perfil.nombre && perfil.nombre !== perfil.usuario ? `${perfil.nombre} · ` : ''}
              {perfil.rol}
            </p>

            {insignias.length > 0 && (
              <div className="perfil__badges-strip">
                {insignias.map((insignia, i) => (
                  <span key={insignia} className="perfil__badge-pill">
                    {i === 0 ? '🏆' : i === 1 ? '🛠️' : '🤝'} {insignia}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="perfil__identity-actions">
          {esPropio ? (
            <>
              <button type="button" className="perfil__action-btn perfil__action-btn--edit" onClick={() => setEditando(true)}>
                ✏️ Editar perfil
              </button>
              <Link to="/publicar" className="perfil__action-btn perfil__action-btn--msg">
                + Publicar proyecto
              </Link>
            </>
          ) : (
            <Link to="/mensajes" className="perfil__action-btn perfil__action-btn--msg">
              ✉️ Enviar mensaje
            </Link>
          )}
        </div>
      </div>

      {editando && <EditarPerfil perfil={perfil} onGuardar={guardar} onCancelar={() => setEditando(false)} />}

      {/* 3. Dos columnas en escritorio */}
      <div className="perfil__layout">
        <aside className="perfil__sidebar">
          <div className="perfil__box">
            <h3 className="perfil__box-title">SOBRE MÍ</h3>
            <p className="perfil__box-text">
              {perfil.sobreMi || (esPropio ? 'Aún no has escrito nada. Usa “Editar perfil” para presentarte.' : 'Este creador aún no ha escrito su presentación.')}
            </p>
          </div>

          <div className="perfil__box">
            <h3 className="perfil__box-title">HABILIDADES &amp; HERRAMIENTAS</h3>
            {habilidades.length ? (
              <div className="perfil__skills-row">
                {habilidades.map((h) => (
                  <span key={h} className="perfil__skill-chip">
                    [ {h} ]
                  </span>
                ))}
              </div>
            ) : (
              <p className="perfil__box-text">Sin habilidades registradas.</p>
            )}
          </div>

          {(enlaces.itch || enlaces.github) && (
            <div className="perfil__box">
              <h3 className="perfil__box-title">REDES &amp; CONTACTO</h3>
              <ul className="perfil__social-list">
                {enlaces.itch && (
                  <li>
                    <span>🎮</span>
                    <a href={enlaceExterno(enlaces.itch)} target="_blank" rel="noopener noreferrer">
                      {enlaces.itch}
                    </a>
                  </li>
                )}
                {enlaces.github && (
                  <li>
                    <span>💻</span>
                    <a href={enlaceExterno(enlaces.github)} target="_blank" rel="noopener noreferrer">
                      {enlaces.github}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </aside>

        <main className="perfil__main">
          <div className="perfil__tabs-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'proyectos'}
              className={`perfil__tab-btn ${activeTab === 'proyectos' ? 'perfil__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('proyectos')}
            >
              Proyectos publicados ({proyectos.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'feedbacks'}
              className={`perfil__tab-btn ${activeTab === 'feedbacks' ? 'perfil__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('feedbacks')}
            >
              Feedbacks otorgados ({feedbacks.length})
            </button>
          </div>

          {activeTab === 'proyectos' &&
            (proyectos.length ? (
              <div className="perfil__projects-grid">
                {proyectos.map((p) => (
                  <ProjectCard key={p.id} proyecto={p} variant="grande" />
                ))}
              </div>
            ) : (
              <div className="perfil__assets-info card">
                <p>{esPropio ? 'Todavía no has publicado proyectos.' : `@${perfil.usuario} aún no ha publicado proyectos.`}</p>
                {esPropio && <Button to="/publicar">Publicar mi primer proyecto</Button>}
              </div>
            ))}

          {activeTab === 'feedbacks' &&
            (feedbacks.length ? (
              <ul className="perfil__feedbacks">
                {feedbacks.map((f) => (
                  <li key={f.id ?? `${f.proyecto.id}-${f.fecha}`} className="perfil__feedback card">
                    <div className="perfil__feedback-head">
                      <Link to={`/proyecto/${f.proyecto.id}`}>{f.proyecto.titulo}</Link>
                      <RatingStars value={f.estrellas} />
                    </div>
                    <p>{f.texto}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="perfil__assets-info card">
                <p>Aún no hay feedbacks enviados a otros proyectos.</p>
              </div>
            ))}
        </main>
      </div>
    </div>
  )
}

export default Perfil
