import { Link } from 'react-router';

export default function Menu() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
      <Link to="/">Inicio</Link>
      <Link to="/creditos">Créditos</Link>
      <Link to="/galeria">Galería</Link>
      <Link to="/registro">Registro</Link>
    </nav>
  )
}
