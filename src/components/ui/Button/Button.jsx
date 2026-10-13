import { Link } from 'react-router'
import './Button.css'

// Botón reutilizable. Si recibe "to" se comporta como enlace de navegación.
export default function Button({ children, to, variant = 'primary', full = false, className = '', ...props }) {
  const clases = `btn btn--${variant} ${full ? 'btn--full' : ''} ${className}`
  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button className={clases} type="button" {...props}>
      {children}
    </button>
  )
}
