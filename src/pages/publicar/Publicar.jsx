import { useState } from 'react'
import Button from '../../components/ui/Button/Button.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { MOTORES } from '../../data/proyectos.js'
import { publicarProyecto } from '../../data/store.js'
import './Publicar.css'

// Reduce la portada a máx. 800px y la convierte a texto (dataURL) para poder guardarla en el navegador
function comprimirImagen(file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const escala = Math.min(1, 800 / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * escala)
      canvas.height = Math.round(img.height * escala)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => resolve(null)
    img.src = URL.createObjectURL(file)
  })
}

// "2D" -> "2D", "CYBERPUNK" -> "Cyberpunk"
const formatoEtiqueta = (t) => (t.length <= 3 ? t : t.charAt(0) + t.slice(1).toLowerCase())

function Publicar() {
  const [titulo, setTitulo] = useState('')
  const [sinopsis, setSinopsis] = useState('')
  const [etiquetas, setEtiquetas] = useState(['2D', 'CYBERPUNK', 'ALPHA'])
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [motor, setMotor] = useState('godot')
  const [archivo, setArchivo] = useState(null)
  const [imagenPortada, setImagenPortada] = useState(null)
  const [publicadoId, setPublicadoId] = useState(null)

  const handleImagenChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagenPortada(await comprimirImagen(file))
    }
  }

  const publicar = (e) => {
    e.preventDefault()
    const id = publicarProyecto({
      titulo,
      sinopsis,
      etiquetas: etiquetas.map(formatoEtiqueta),
      motor,
      portada: imagenPortada,
      archivo: archivo?.name,
    })
    setPublicadoId(id)
  }

  const reiniciar = () => {
    setTitulo('')
    setSinopsis('')
    setImagenPortada(null)
    setArchivo(null)
    setPublicadoId(null)
  }

  const agregarEtiqueta = (e) => {
    e.preventDefault()
    if (nuevaEtiqueta.trim() && !etiquetas.includes(nuevaEtiqueta.trim().toUpperCase())) {
      setEtiquetas([...etiquetas, nuevaEtiqueta.trim().toUpperCase()])
      setNuevaEtiqueta('')
    }
  }

  if (publicadoId) {
    return (
      <div className="page page--narrow publicar__ok">
        <h1>¡Proyecto publicado!</h1>
        <p className="muted">
          “{titulo}” ya aparece como <strong>nuevo</strong> en Explorar y en tu perfil. Pronto llegarán los primeros feedbacks.
        </p>
        <Button to={`/proyecto/${publicadoId}`} full>
          Ver mi proyecto
        </Button>
        <Button to="/galeria" variant="ghost" full>
          Ver en Explorar
        </Button>
        <Button variant="ghost" full onClick={reiniciar}>
          Publicar otro
        </Button>
      </div>
    )
  }

  return (
    <form
      className="page publicar"
      onSubmit={publicar}
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
              <button
                key={tag}
                type="button"
                className="publicar__tag-chip"
                onClick={() => setEtiquetas(etiquetas.filter((t) => t !== tag))}
                title="Quitar etiqueta"
              >
                [ {tag} ✕ ]
              </button>
            ))}
            <input
              className="publicar__tag-input"
              value={nuevaEtiqueta}
              onChange={(e) => setNuevaEtiqueta(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarEtiqueta(e)}
              placeholder="+ etiqueta (Enter)"
              aria-label="Agregar etiqueta"
              maxLength={20}
            />
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
          Publicar proyecto
        </button>
      </div>
    </form>
  )
}

export default Publicar
