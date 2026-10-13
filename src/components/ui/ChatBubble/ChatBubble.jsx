import './ChatBubble.css'

export default function ChatBubble({ texto, propio = false }) {
  return <p className={`bubble ${propio ? 'bubble--own' : ''}`}>{texto}</p>
}
