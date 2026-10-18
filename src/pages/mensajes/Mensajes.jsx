import { useState } from 'react'
import { Link } from 'react-router'
import Icon from '../../components/ui/Icon.jsx'
import { CONVERSACIONES, USUARIOS } from '../../data/proyectos.js'
import './Mensajes.css'

function Mensajes() {
  const [chats, setChats] = useState(CONVERSACIONES)
  const [activo, setActivo] = useState(CONVERSACIONES[0].usuario)
  const [texto, setTexto] = useState('')

  const chat = chats.find((c) => c.usuario === activo) || chats[0]
  const contacto = USUARIOS[activo] || { usuario: activo, avatar: 'images/avatares/lauraart.png' }

  const enviar = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    setChats(
      chats.map((c) =>
        c.usuario === activo ? { ...c, mensajes: [...c.mensajes, { de: 'yo', texto: texto.trim() }] } : c
      )
    )
    setTexto('')
  }

  return (
    <div className="mensajes">
      {/* Columna lateral de avatares con fondo morado */}
      <aside className="mensajes__sidebar" aria-label="Contactos">
        {chats.map((c) => {
          const u = USUARIOS[c.usuario] || {}
          const avatarUrl = u.avatar || 'images/avatares/lauraart.png'
          const esActivo = c.usuario === activo
          return (
            <button
              key={c.usuario}
              type="button"
              className={`mensajes__avatar-btn ${esActivo ? 'mensajes__avatar-btn--activo' : ''}`}
              onClick={() => setActivo(c.usuario)}
              aria-label={`Chat con @${c.usuario}`}
              aria-current={esActivo}
            >
              <img src={avatarUrl} alt={c.usuario} className="mensajes__avatar-img" />
            </button>
          )
        })}
      </aside>

      {/* Ventana de chat activa */}
      <section className="mensajes__chat-area">
        <header className="mensajes__chat-head">
          <img
            src={contacto.avatar || 'images/avatares/lauraart.png'}
            alt={contacto.usuario}
            className="mensajes__head-avatar"
          />
          <Link to={`/perfil/${contacto.usuario}`} className="mensajes__head-name">
            @{contacto.usuario.toUpperCase()}
          </Link>
        </header>

        <div className="mensajes__burbujas" aria-live="polite">
          {chat.mensajes.map((m, i) => (
            <div
              key={i}
              className={`mensajes__burbuja ${m.de === 'yo' ? 'mensajes__burbuja--propio' : 'mensajes__burbuja--recibido'}`}
            >
              <p>{m.texto}</p>
            </div>
          ))}
        </div>

        <form className="mensajes__input-bar" onSubmit={enviar}>
          <button type="button" className="mensajes__icon-btn" aria-label="Adjuntar archivo">
            <Icon name="paperclip" size={20} />
          </button>
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un mensaje…"
            aria-label="Mensaje"
            className="mensajes__input-field"
          />
          <button type="submit" className="mensajes__icon-btn mensajes__icon-btn--send" aria-label="Enviar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </section>
    </div>
  )
}

export default Mensajes
