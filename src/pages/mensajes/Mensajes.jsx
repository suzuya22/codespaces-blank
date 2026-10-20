import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import Icon from '../../components/ui/Icon.jsx'
import { USUARIOS } from '../../data/proyectos.js'
import { useChats, enviarMensaje, marcarLeido, useProyectos } from '../../data/store.js'
import './Mensajes.css'

const AVATAR_DEFECTO = 'images/avatares/avatar-4.png'

function formatoHora(ms) {
  if (!ms) return ''
  const fecha = new Date(ms)
  const hoy = new Date()
  const mismoDia = fecha.toDateString() === hoy.toDateString()
  return mismoDia
    ? fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    : fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

// Mensajes que el usuario aún no ha visto en una conversación
function noLeidos(chat, leidos) {
  const total = chat.mensajes.length
  if (leidos[chat.usuario] !== undefined) return Math.max(0, total - leidos[chat.usuario])
  let n = 0
  for (let i = total - 1; i >= 0 && chat.mensajes[i].de !== 'yo'; i--) n++
  return chat.usuario === 'lauraart' ? 0 : n
}

/*
  Distribución adaptable:
  - Celular: se ve la lista de chats; al tocar uno se abre a pantalla completa con botón "volver".
  - Tablet: lista a la izquierda + conversación.
  - Escritorio: lista + conversación + panel con el perfil del contacto.
*/
function Mensajes() {
  const { chats, leidos } = useChats()
  const proyectos = useProyectos()
  const [params, setParams] = useSearchParams()
  const [filtro, setFiltro] = useState('')
  const [texto, setTexto] = useState('')
  const [escribiendo, setEscribiendo] = useState({})
  const finRef = useRef(null)
  const inputRef = useRef(null)

  const abierto = params.get('chat') // en celular decide si se ve la lista o el chat
  const activo = abierto ?? chats[0].usuario
  const chat = chats.find((c) => c.usuario === activo) ?? chats[0]
  const contacto = USUARIOS[chat.usuario] ?? { usuario: chat.usuario, nombre: chat.usuario }
  const proyectosContacto = proyectos.filter((p) => p.autor === chat.usuario).slice(0, 3)

  const visibles = chats
    .filter((c) => {
      const u = USUARIOS[c.usuario]
      return `${c.usuario} ${u?.nombre ?? ''}`.toLowerCase().includes(filtro.trim().toLowerCase())
    })
    .sort((a, b) => (b.mensajes.at(-1)?.hora ?? 0) - (a.mensajes.at(-1)?.hora ?? 0))

  // Baja al último mensaje y lo marca como leído
  useEffect(() => {
    finRef.current?.scrollIntoView({ block: 'end' })
    marcarLeido(chat.usuario)
  }, [chat.usuario, chat.mensajes.length, escribiendo])

  const abrirChat = (usuario) => {
    setParams({ chat: usuario })
    setTexto('')
  }

  const enviar = (e) => {
    e.preventDefault()
    const limpio = texto.trim()
    if (!limpio) return
    const destino = chat.usuario
    setEscribiendo((prev) => ({ ...prev, [destino]: true }))
    enviarMensaje(destino, limpio, () => setEscribiendo((prev) => ({ ...prev, [destino]: false })))
    setTexto('')
    inputRef.current?.focus()
  }

  return (
    <div className={`mensajes ${abierto ? 'mensajes--chat-abierto' : ''}`}>
      {/* 1. Lista de conversaciones */}
      <aside className="mensajes__lista" aria-label="Conversaciones">
        <div className="mensajes__lista-head">
          <h1 className="mensajes__titulo">Mensajes</h1>
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
            const u = USUARIOS[c.usuario] ?? {}
            const ultimo = c.mensajes.at(-1)
            const pendientes = c.usuario === activo ? 0 : noLeidos(c, leidos)
            return (
              <li key={c.usuario}>
                <button
                  type="button"
                  className={`mensajes__contacto ${c.usuario === activo ? 'mensajes__contacto--activo' : ''}`}
                  onClick={() => abrirChat(c.usuario)}
                  aria-current={c.usuario === activo}
                >
                  <img src={u.avatar ?? AVATAR_DEFECTO} alt="" className="mensajes__avatar" />
                  <span className="mensajes__contacto-info">
                    <span className="mensajes__contacto-top">
                      <strong>{u.nombre ?? c.usuario}</strong>
                      <small>{formatoHora(ultimo?.hora)}</small>
                    </span>
                    <span className="mensajes__contacto-bottom">
                      <span className="mensajes__preview">
                        {escribiendo[c.usuario] ? (
                          <em>escribiendo…</em>
                        ) : (
                          <>
                            {ultimo?.de === 'yo' && 'Tú: '}
                            {ultimo?.texto}
                          </>
                        )}
                      </span>
                      {pendientes > 0 && <span className="mensajes__badge">{pendientes}</span>}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
          {visibles.length === 0 && <li className="mensajes__vacio">No hay conversaciones con ese nombre.</li>}
        </ul>
      </aside>

      {/* 2. Conversación */}
      <section className="mensajes__chat" aria-label={`Conversación con ${contacto.nombre}`}>
        <header className="mensajes__chat-head">
          <button type="button" className="mensajes__volver" onClick={() => setParams({})} aria-label="Volver a la lista">
            ←
          </button>
          <img src={contacto.avatar ?? AVATAR_DEFECTO} alt="" className="mensajes__avatar mensajes__avatar--sm" />
          <div className="mensajes__chat-titulo">
            <Link to={`/perfil/${chat.usuario}`}>{contacto.nombre}</Link>
            <small className={escribiendo[chat.usuario] ? 'mensajes__estado--escribiendo' : ''}>
              {escribiendo[chat.usuario] ? 'escribiendo…' : `@${chat.usuario} · en línea`}
            </small>
          </div>
        </header>

        <div className="mensajes__burbujas" aria-live="polite">
          {chat.mensajes.map((m, i) => (
            <div key={i} className={`mensajes__burbuja ${m.de === 'yo' ? 'mensajes__burbuja--propio' : ''}`}>
              <p>{m.texto}</p>
              <time>{formatoHora(m.hora)}</time>
            </div>
          ))}
          {escribiendo[chat.usuario] && (
            <div className="mensajes__burbuja mensajes__typing" aria-label={`${contacto.nombre} está escribiendo`}>
              <span />
              <span />
              <span />
            </div>
          )}
          <div ref={finRef} />
        </div>

        <form className="mensajes__form" onSubmit={enviar}>
          <button type="button" className="mensajes__icon-btn" aria-label="Adjuntar archivo">
            <Icon name="paperclip" size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={`Escribe a ${contacto.nombre}…`}
            aria-label="Mensaje"
            className="mensajes__input"
            autoComplete="off"
          />
          <button type="submit" className="mensajes__icon-btn mensajes__icon-btn--enviar" aria-label="Enviar" disabled={!texto.trim()}>
            <Icon name="send" size={20} />
          </button>
        </form>
      </section>

      {/* 3. Perfil del contacto (solo escritorio) */}
      <aside className="mensajes__info" aria-label="Información del contacto">
        <img src={contacto.avatar ?? AVATAR_DEFECTO} alt="" className="mensajes__info-avatar" />
        <h2>{contacto.nombre}</h2>
        <p className="mensajes__info-rol">{contacto.rol}</p>
        {contacto.sobreMi && <p className="mensajes__info-bio">{contacto.sobreMi}</p>}
        {contacto.habilidades && (
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
                {p.titulo} <small>⭐ {p.rating.toFixed(1)}</small>
              </Link>
            ))}
          </div>
        )}
        <Link to={`/perfil/${chat.usuario}`} className="mensajes__info-btn">
          Ver perfil completo
        </Link>
      </aside>
    </div>
  )
}

export default Mensajes
