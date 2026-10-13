import './Tag.css'

// Etiqueta pequeña. Si recibe onClick se vuelve un "chip" seleccionable.
export default function Tag({ children, active = false, onClick }) {
  if (onClick) {
    return (
      <button type="button" className={`tag tag--chip ${active ? 'tag--active' : ''}`} onClick={onClick} aria-pressed={active}>
        {children}
      </button>
    )
  }
  return <span className="tag">{children}</span>
}
