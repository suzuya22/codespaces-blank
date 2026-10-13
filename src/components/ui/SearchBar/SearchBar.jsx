import Icon from '../Icon.jsx'
import './SearchBar.css'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Buscar proyectos, assets o creadores', onFilter }) {
  return (
    <form
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(value)
      }}
    >
      {onFilter && (
        <button type="button" className="search__btn" onClick={onFilter} aria-label="Mostrar filtros">
          <Icon name="filter" size={18} />
        </button>
      )}
      <input
        className="search__input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar"
      />
      <button type="submit" className="search__btn" aria-label="Buscar">
        <Icon name="search" size={18} />
      </button>
    </form>
  )
}
