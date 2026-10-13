import { Link } from 'react-router'
import { PixelCover } from '../PixelArt.jsx'
import { nombreMotor } from '../../../data/proyectos.js'
import './ProjectCard.css'

// Tarjeta de proyecto. variant: "grande" (explorar) o "mini" (carruseles)
export default function ProjectCard({ proyecto, variant = 'grande' }) {
  const { id, titulo, version, estado, feedbacks, paleta, motor } = proyecto
  return (
    <Link to={`/proyecto/${id}`} className={`pcard pcard--${variant}`}>
      <div className="pcard__media">
        <PixelCover seed={id} palette={paleta} className="pcard__cover" />
        <span className="pcard__title">{titulo}</span>
      </div>
      {variant === 'grande' && (
        <div className="pcard__meta">
          <span>{version}</span>
          <span>{estado === 'equipo' ? 'Buscando equipo' : 'Necesita playtest'}</span>
          <span>{nombreMotor(motor)}</span>
          <span>💬 {feedbacks} feedbacks</span>
        </div>
      )}
    </Link>
  )
}
