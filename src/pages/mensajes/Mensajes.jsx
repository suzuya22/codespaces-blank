import { useState } from 'react'
import { Link } from 'react-router'
import { PixelAvatar } from '../../components/ui/PixelArt.jsx'
import ChatBubble from '../../components/ui/ChatBubble/ChatBubble.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { CONVERSACIONES, USUARIOS } from '../../data/proyectos.js'
import './Mensajes.css'

function Mensajes() {
  const [chats, setChats] = useState(CONVERSACIONES)
  const [activo, setActivo] = useState(CONVERSACIONES[0].usuario)
  const [texto, setTexto] = useState('')

  const chat = chats.find((c) => c.usuario === activo)

  const enviar = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    setChats(chats.map((c) => (c.usuario === activo ? { ...c, mensajes: [...c.mensajes, { de: 'yo', texto: texto.trim() }] } : c)))
    setTexto('')
  }

  return (
    <div className="mensajes">
      {/* Móvil: columna de avatares. Tablet: lista con nombres */}
      <nav className="mensajes__lista" aria-label="Conversaciones">
        <h1 className="mensajes__titulo">Mensajes</h1>
        {chats.map((c) => (
          <button
            key={c.usuario}
            type="button"
            className={`mensajes__contacto ${c.usuario === activo ? 'mensajes__contacto--activo' : ''}`}
            onClick={() => setActivo(c.usuario)}
            aria-label={`Chat con ${c.usuario}`}
            aria-current={c.usuario === activo}
          >
            <PixelAvatar seed={c.usuario} size={40} />
            <span className="mensajes__nombre">
              <strong>@{c.usuario}</strong>
              <small>{c.mensajes.at(-1).texto}</small>
            </span>
          </button>
        ))}
      </nav>

      <section className="mensajes__chat">
        <header className="mensajes__head">
          <PixelAvatar seed={activo} size={36} />
          <Link to={`/perfil/${activo}`}>@{activo}</Link>
          <small className="muted">{USUARIOS[activo]?.rol}</small>
        </header>
        <div className="mensajes__burbujas" aria-live="polite">
          {chat.mensajes.map((m, i) => (
            <ChatBubble key={i} texto={m.texto} propio={m.de === 'yo'} />
          ))}
        </div>
        <form className="mensajes__form" onSubmit={enviar}>
          <Icon name="paperclip" size={18} />
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe un mensaje…" aria-label="Mensaje" />
          <button type="submit" aria-label="Enviar">
            <Icon name="send" size={20} />
          </button>
        </form>
      </section>
    </div>
  )
}

export default Mensajes
