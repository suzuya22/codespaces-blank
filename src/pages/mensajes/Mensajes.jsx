import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import Icon from '../../components/ui/Icon.jsx'
import Avatar from '../../components/ui/Avatar/Avatar.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import { useProyectos } from '../../data/store.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { useActividad, sinLeer } from '../../auth/ActividadContext.jsx'
import { servicio, mensajeError } from '../../servicios/index.js'
import './Mensajes.css'

function formatoHora(ms) {
  if (!ms) return ''
  const fecha = new Date(ms)
  const mismoDia = fecha.toDateString() === new Date().toDateString()
  return mismoDia
    ? fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    : fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

// Perfiles de los contactos (avatar, rol, bio). Se piden una vez y se guardan en memoria.
const cachePerfiles = {}
function usePerfiles(nombres) {
  const [, refrescar] = useState(0)
  const clave = nombres.join(',')
  useEffect(() => {
    let vivo = true
    for (const n of clave ? clave.split(',') : []) {
      if (n in cachePerfiles) continue
      cachePerfiles[n] = null
      servicio
        .obtenerPerfil(n)
        .then((p) => {
          cachePerfiles[n] = p
          if (vivo) refrescar((x) => x + 1)
        })
        .catch(() => {})
    }
    return () => {
      vivo = false
    }
  }, [clave])
  return cachePerfiles
}

/*
  Mensajes reales entre cuentas.
  - Celular: lista de chats; al tocar uno se abre a pantalla completa con botón "volver".
  - Tablet: lista + conversación.  Escritorio: lista + conversación + perfil del contacto.
  Para empezar un chat: botón "Enviar mensaje" en un perfil (/mensajes?con=usuario).
*/
function Mensajes() {
  const { usuario: yo, listo, cargando } = useAuth()
  const { conversaciones, pendientes } = useActividad()
  const proyectos = useProyectos()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('')
  const [texto, setTexto] = useState('')
  const [mensajes, setMensajes] = useState({ id: null, lista: [] })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const finRef = useRef(null)
  const inputRef = useRef(null)

  const uid = yo?.uid
  const otroDe = (c) => c.participantes.find((p) => p !== uid) ?? uid
  const nombreDe = (c) => c.nombres?.[otroDe(c)] ?? 'usuario'
  const perfiles = usePerfiles(useMemo(() => conversaciones.map(nombreDe).sort(), [conversaciones])) // eslint-disable-line react-hooks/exhaustive-deps

  const abierto = params.get('chat') // en celular decide si se ve la lista o el chat
  const activa = conversaciones.find((c) => c.id === abierto) ?? (abierto ? null : conversaciones[0])

  // /mensajes?con=usuario → abre (o crea) la conversación con esa persona
  const con = params.get('con')
  useEffect(() => {
    if (!con || !listo) return
    let vivo = true
    ;(async () => {
      try {
        const perfil = await servicio.obtenerPerfil(con)
        if (!perfil?.uid || perfil.uid === yo.uid) throw Object.assign(new Error(), { code: 'usuario-no-encontrado' })
        const id = await servicio.abrirConversacion(yo, { uid: perfil.uid, usuario: perfil.usuario })
        if (vivo) setParams({ chat: id }, { replace: true })
      } catch (err) {
        if (vivo) {
          setError(err.code === 'usuario-no-encontrado' ? `No se puede escribir a @${con}.` : mensajeError(err))
          setParams({}, { replace: true })
        }
      }
    })()
    return () => {
      vivo = false
    }
  }, [con, listo]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mensajes en vivo de la conversación abierta
  const idActiva = activa?.id
  useEffect(() => {
    if (!idActiva) return
    return servicio.escucharMensajes(idActiva, (lista) => setMensajes({ id: idActiva, lista }), () => setError('No se pudieron cargar los mensajes.'))
  }, [idActiva])
  const lista = mensajes.id === idActiva ? mensajes.lista : []

  // Baja al último mensaje y marca la conversación como leída
  const hayNuevos = activa ? sinLeer(activa, uid) : false
  useEffect(() => {
    finRef.current?.scrollIntoView({ block: 'end' })
  }, [lista.length, idActiva])
  useEffect(() => {
    if (idActiva && hayNuevos) servicio.marcarLeida(idActiva, uid).catch(() => {})
  }, [idActiva, hayNuevos, uid])

  if (!cargando && !listo) {
    return (
      <div className="page page--narrow mensajes__gate">
        <h1>Mensajes</h1>
        <p className="muted">Inicia sesión para hablar con otros creadores y recibir solicitudes para unirse a tus proyectos.</p>
        <Button to="/login?volver=/mensajes" full>
          Iniciar sesión
        </Button>
        <Button to="/registro?volver=/mensajes" variant="ghost" full>
          Crear cuenta
        </Button>
      </div>
    )
  }

  const nombreActivo = activa ? nombreDe(activa) : null
  const contacto = (nombreActivo && perfiles[nombreActivo]) || (nombreActivo ? { usuario: nombreActivo, nombre: nombreActivo } : null)
  const proyectosContacto = nombreActivo ? proyectos.filter((p) => p.autor === nombreActivo).slice(0, 3) : []

  const visibles = conversaciones.filter((c) => {
    const n = nombreDe(c)
    return `${n} ${perfiles[n]?.nombre ?? ''}`.toLowerCase().includes(filtro.trim().toLowerCase())
  })

  const enviar = async (e) => {
    e.preventDefault()
    const limpio = texto.trim()
    if (!limpio || !activa) return
    setTexto('')
    setEnviando(true)
    setError('')
    try {
      await servicio.enviarMensaje(activa.id, yo, limpio.slice(0, 2000))
    } catch (err) {
      setTexto(limpio)
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className={`mensajes ${abierto ? 'mensajes--chat-abierto' : ''}`}>
      {/* 1. Lista de conversaciones */}
      <aside className="mensajes__lista" aria-label="Conversaciones">
        <div className="mensajes__lista-head">
          <h1 className="mensajes__titulo">Mensajes</h1>
          {pendientes > 0 && (
            <Link to={`/perfil/${yo.usuario}?tab=solicitudes`} className="mensajes__aviso">
              🤝 {pendientes === 1 ? '1 persona quiere' : `${pendientes} personas quieren`} unirse a tus proyectos →
            </Link>
          )}
          <label className="mensajes__buscar">
            <Icon name="search" size={16} />
            <input
              type="search"
              placeholder="Buscar conversación"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              aria-label="Buscar conversación"
            />
          </label>
        </div>

        <ul className="mensajes__contactos">
          {visibles.map((c) => {
            const n = nombreDe(c)
            const p = perfiles[n]
            const pendiente = c.id !== activa?.id && sinLeer(c, uid)
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className={`mensajes__contacto ${c.id === activa?.id ? 'mensajes__contacto--activo' : ''}`}
                  onClick={() => {
                    setParams({ chat: c.id })
                    setTexto('')
                  }}
                  aria-current={c.id === activa?.id}
                >
                  <Avatar perfil={p ?? undefined} usuario={n} size={48} className="mensajes__avatar" />
                  <span className="mensajes__contacto-info">
                    <span className="mensajes__contacto-top">
                      <strong>{p?.nombre ?? n}</strong>
                      <small>{formatoHora(c.ultimo?.fecha ?? c.actualizado)}</small>
                    </span>
                    <span className="mensajes__contacto-bottom">
                      <span className="mensajes__preview">
                        {c.ultimo ? (
                          <>
                            {c.ultimo.autorUid === uid && 'Tú: '}
                            {c.ultimo.texto}
                          </>
                        ) : (
                          <em>Conversación nueva</em>
                        )}
                      </span>
                      {pendiente && <span className="mensajes__badge">●</span>}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
          {conversaciones.length === 0 && (
            <li className="mensajes__vacio">
              Aún no tienes conversaciones. Escríbele a alguien con el botón “Enviar mensaje” de su perfil, o acepta una solicitud para unirse a tu proyecto.
            </li>
          )}
          {conversaciones.length > 0 && visibles.length === 0 && <li className="mensajes__vacio">No hay conversaciones con ese nombre.</li>}
        </ul>
      </aside>

      {/* 2. Conversación */}
      <section className="mensajes__chat" aria-label={contacto ? `Conversación con ${contacto.nombre}` : 'Conversación'}>
        {activa && contacto ? (
          <>
            <header className="mensajes__chat-head">
              <button type="button" className="mensajes__volver" onClick={() => setParams({})} aria-label="Volver a la lista">
                ←
              </button>
              <Avatar perfil={perfiles[nombreActivo] ?? undefined} usuario={nombreActivo} size={38} className="mensajes__avatar mensajes__avatar--sm" />
              <div className="mensajes__chat-titulo">
                <Link to={`/perfil/${nombreActivo}`}>{contacto.nombre}</Link>
                <small>@{nombreActivo}</small>
              </div>
            </header>

            <div className="mensajes__burbujas" aria-live="polite">
              {lista.length === 0 && <p className="mensajes__vacio">Escribe el primer mensaje para @{nombreActivo}.</p>}
              {lista.map((m) => (
                <div key={m.id} className={`mensajes__burbuja ${m.autorUid === uid ? 'mensajes__burbuja--propio' : ''}`}>
                  <p>{m.texto}</p>
                  <time>{formatoHora(m.fecha)}</time>
                </div>
              ))}
              <div ref={finRef} />
            </div>

            {error && (
              <p className="mensajes__error" role="alert">
                {error}
              </p>
            )}
            <form className="mensajes__form" onSubmit={enviar}>
              <input
                ref={inputRef}
                type="text"
                value={texto}
                maxLength={2000}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={`Escribe a ${contacto.nombre}…`}
                aria-label="Mensaje"
                className="mensajes__input"
                autoComplete="off"
              />
              <button type="submit" className="mensajes__icon-btn mensajes__icon-btn--enviar" aria-label="Enviar" disabled={!texto.trim() || enviando}>
                <Icon name="send" size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="mensajes__sin-chat">
            {con ? (
              <p>Abriendo conversación…</p>
            ) : (
              <>
                {error && <p className="mensajes__error">{error}</p>}
                <p>Elige una conversación o busca creadores en Explorar para escribirles.</p>
                <Button variant="ghost" onClick={() => navigate('/galeria')}>
                  Ir a Explorar
                </Button>
              </>
            )}
          </div>
        )}
      </section>

      {/* 3. Perfil del contacto (solo escritorio) */}
      {contacto && (
        <aside className="mensajes__info" aria-label="Información del contacto">
          <Avatar perfil={perfiles[nombreActivo] ?? undefined} usuario={nombreActivo} size={96} className="mensajes__info-avatar" />
          <h2>{contacto.nombre}</h2>
          {contacto.rol && <p className="mensajes__info-rol">{contacto.rol}</p>}
          {contacto.sobreMi && <p className="mensajes__info-bio">{contacto.sobreMi}</p>}
          {contacto.habilidades?.length > 0 && (
            <div className="mensajes__info-skills">
              {contacto.habilidades.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
          )}
          {proyectosContacto.length > 0 && (
            <div className="mensajes__info-proyectos">
              <h3>Proyectos</h3>
              {proyectosContacto.map((p) => (
                <Link key={p.id} to={`/proyecto/${p.id}`}>
                  {p.titulo} <small>⭐ {p.rating ? p.rating.toFixed(1) : '—'}</small>
                </Link>
              ))}
            </div>
          )}
          <Link to={`/perfil/${nombreActivo}`} className="mensajes__info-btn">
            Ver perfil completo
          </Link>
        </aside>
      )}
    </div>
  )
}

export default Mensajes
