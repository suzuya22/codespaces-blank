import { Link } from 'react-router'
import Icon from '../Icon.jsx'
import './SectionHeader.css'

export default function SectionHeader({ title, to, actionLabel = 'Ver más' }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {to && (
        <Link to={to} className="section-header__link" aria-label={`${actionLabel}: ${title}`}>
          <span className="section-header__text">{actionLabel}</span>
          <Icon name="plus" size={18} />
        </Link>
      )}
    </div>
  )
}
