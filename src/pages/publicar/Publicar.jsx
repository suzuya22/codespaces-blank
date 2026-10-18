import { useState } from 'react'
import Button from '../../components/ui/Button/Button.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { MOTORES } from '../../data/proyectos.js'
import './Publicar.css'

function Publicar() {
  const [titulo, setTitulo] = useState('')
  const [sinopsis, setSinopsis] = useState('')
  const [etiquetas, setEtiquetas] = useState(['2D', 'CYBERPUNK', 'ALPHA'])
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [motor, setMotor] = useState('godot')
  const [archivo, setArchivo] = useState(null)
  const [imagenPortada, setImagenPortada] = useState(null)
  const [publicado, setPublicado] = useState(false)

  const handleImagenChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagenPortada(URL.createObjectURL(file))
    }
  }

  const agregarEtiqueta = (e) => {
    e.preventDefault()
    if (nuevaEtiqueta.trim() && !etiquetas.includes(nuevaEtiqueta.trim().toUpperCase())) {
      setEtiquetas([...etiquetas, nuevaEtiqueta.trim().toUpperCase()])
      setNuevaEtiqueta('')
    }
  }

  if (publicado) {
    return (
      <div className="page page--narrow publicar__ok">
        <h1>¡Proyecto publicado!</h1>
        <p className="muted">“{titulo || 'Tu proyecto'}” ya está visible para la comunidad. Pronto llegarán los primeros feedbacks.</p>
        <Button to="/galeria" full>
          VER EN EXPLORAR
        </Button>
        <Button variant="ghost" full onClick={() => setPublicado(false)}>
          PUBLICAR OTRO
        </Button>
      </div>
    )
  }

  return (
    <form
      className="page publicar"
      onSubmit={(e) => {
        e.preventDefault()
        setPublicado(true)
      }}
    >
      <div className="publicar__preview-container">
        <label className="publicar__preview-label">
          {imagenPortada ? (
            <img src={imagenPortada} alt="Vista previa" className="publicar__preview-img" />
          ) : (
            <div className="publicar__placeholder-box">
              <img src="images/proyectos/placeholder.png" alt="Subir portada" className="publicar__placeholder-icon" />
              <span className="publicar__upload-hint">Haz clic para subir portada</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImagenChange} style={{ display: 'none' }} />
        </label>
      </div>

      <div className="publicar__form-body">
        <div className="publicar__title-pill">
          <input
            type="text"
            required
            placeholder="TÍTULO DEL PROYECTO"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="publicar__title-input"
          />
        </div>

        <div className="publicar__sinopsis-box">
          <textarea
            required
            rows={3}
            placeholder="SINOPSIS DEL PROYECTO"
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            className="publicar__sinopsis-textarea"
          />
          <div className="publicar__tags-row">
            {etiquetas.map((tag) => (
              <span key={tag} className="publicar__tag-chip">
                [ + {tag} ]
              </span>
            ))}
          </div>
        </div>

        <div className="publicar__engine-section">
          <div className="publicar__engine-radios">
            {MOTORES.filter((m) => m.id !== 'todos').map((m) => (
              <label key={m.id} className="publicar__engine-opt">
                <input
                  type="radio"
                  name="motor"
                  value={m.id}
                  checked={motor === m.id}
                  onChange={() => setMotor(m.id)}
                />
                <span className="publicar__radio-dot"></span>
                <img src={m.logo} alt={m.nombre} className="publicar__engine-logo" />
              </label>
            ))}
          </div>
        </div>

        <label className="publicar__build-drop">
          <Icon name="upload" size={20} />
          <span>{archivo ? archivo.name : 'ARRASTRA TU BUILD (.ZIP)'}</span>
          <input type="file" accept=".zip" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
        </label>

        <button type="submit" className="publicar__submit-btn">
          PUBLICAR PROYECTO
        </button>
      </div>
    </form>
  )
}

export default Publicar
