import { Link } from 'react-router'
import { PixelCover } from '../PixelArt.jsx'
import './ProjectCard.css'

// Tarjeta de proyecto. variant: "grande" (explorar) o "mini" (carruseles)
export default function ProjectCard({ proyecto, variant = 'grande' }) {
  const { id, titulo, version, estado, feedbacks, paleta, portada, publicadoPorUsuario } = proyecto

  return (
    <Link to={`/proyecto/${id}`} className={`pcard pcard--${variant}`}>
      <div className="pcard__media">
        {portada ? (
          <img src={portada} alt={titulo} className="pcard__img" loading="lazy" />
        ) : (
          <PixelCover seed={id} palette={paleta || ['#1a0f2e', '#6b2fb3', '#e04f6c', '#f2c14e']} className="pcard__cover" />
        )}
        {publicadoPorUsuario && <span className="pcard__badge-nuevo">✦ NUEVO</span>}
        <div className="pcard__title-strip">
          <span className="pcard__title">{titulo.toUpperCase()}</span>
        </div>
      </div>
      {variant === 'grande' && (
        <div className="pcard__meta">
          <span className="pcard__meta-item">{version.toUpperCase()}</span>
          <span className="pcard__meta-item">{estado === 'equipo' ? 'BUSCANDO EQUIPO' : 'NECESITA PLAYTEST'}</span>
          <span className="pcard__meta-item pcard__meta-item--feedbacks">💬 {feedbacks} FEEDBACKS</span>
        </div>
      )}
    </Link>
  )
}
