import Icon from '../Icon.jsx'
import './RatingStars.css'

// Calificación de 1 a 5. Si recibe onChange es interactiva.
export default function RatingStars({ value, onChange }) {
  return (
    <div className="stars" role={onChange ? 'radiogroup' : 'img'} aria-label={`Calificación ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} estrellas`}
            className="stars__btn"
            onClick={() => onChange(n)}
          >
            <Icon name="star" size={22} filled={n <= value} />
          </button>
        ) : (
          <Icon key={n} name="star" size={16} filled={n <= Math.round(value)} />
        ),
      )}
    </div>
  )
}
