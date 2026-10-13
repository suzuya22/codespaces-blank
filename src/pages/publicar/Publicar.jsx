import { useState } from 'react'
import { PixelCover } from '../../components/ui/PixelArt.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Tag from '../../components/ui/Tag/Tag.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { MOTORES } from '../../data/proyectos.js'
import './Publicar.css'

const PALETA = ['#1a0f2e', '#6b2fb3', '#e04f6c', '#f2c14e']

function Publicar() {
  const [titulo, setTitulo] = useState('')
  const [sinopsis, setSinopsis] = useState('')
  const [etiquetas, setEtiquetas] = useState('2D, Cyberpunk, Alpha')
  const [motor, setMotor] = useState('unity')
  const [archivo, setArchivo] = useState(null)
  const [publicado, setPublicado] = useState(false)

  if (publicado) {
    return (
      <div className="page page--narrow publicar__ok">
        <h1>¡Proyecto publicado!</h1>
        <p className="muted">“{titulo}” ya está visible para la comunidad. Pronto llegarán los primeros feedbacks.</p>
        <Button to="/galeria" full>
          Ver en explorar
        </Button>
        <Button variant="ghost" full onClick={() => setPublicado(false)}>
          Publicar otro
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
      <h1 className="publicar__title">Publicar proyecto</h1>

      <div className="publicar__preview">
        {/* La portada se genera a partir del título */}
        <PixelCover seed={titulo || 'nuevo-proyecto'} palette={PALETA} label="Vista previa de la portada" />
        <span>{titulo || 'Título del proyecto'}</span>
      </div>

      <div className="publicar__campos">
        <InputField label="Título del proyecto" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <InputField label="Sinopsis" as="textarea" required value={sinopsis} onChange={(e) => setSinopsis(e.target.value)} />
        <InputField label="Etiquetas" value={etiquetas} onChange={(e) => setEtiquetas(e.target.value)} hint="Sepáralas con comas" />

        <fieldset className="publicar__motor">
          <legend>Motor</legend>
          <div className="publicar__chips">
            {MOTORES.filter((m) => m.id !== 'todos').map((m) => (
              <Tag key={m.id} active={motor === m.id} onClick={() => setMotor(m.id)}>
                {m.nombre}
              </Tag>
            ))}
          </div>
        </fieldset>

        <label className="publicar__drop">
          <Icon name="upload" />
          <span>{archivo ? archivo.name : 'Arrastra tu build (.zip) o haz clic'}</span>
          <input type="file" accept=".zip" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
        </label>

        <Button type="submit" full>
          Publicar proyecto
        </Button>
      </div>
    </form>
  )
}

export default Publicar
