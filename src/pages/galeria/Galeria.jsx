import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import SearchBar from '../../components/ui/SearchBar/SearchBar.jsx'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import { PROYECTOS, MOTORES, ESTADOS } from '../../data/proyectos.js'
import './Galeria.css'

// Explorar proyectos: búsqueda + filtros por motor y estado (idéntico a Figma)
function Galeria() {
  const [params, setParams] = useSearchParams()
  const [busqueda, setBusqueda] = useState(params.get('q') ?? '')
  const [motor, setMotor] = useState('todos')
  const [estado, setEstado] = useState('todos')
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true)

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return PROYECTOS.filter((p) => {
      const coincide = !q || [p.titulo, p.autor, ...p.generos].join(' ').toLowerCase().includes(q)
      return coincide && (motor === 'todos' || p.motor === motor) && (estado === 'todos' || p.estado === estado)
    })
  }, [busqueda, motor, estado])

  return (
    <div className="page galeria">
      <h1 className="galeria__title">EXPLORAR PROYECTOS</h1>

      <div className="galeria__layout">
        <aside className="galeria__filtros">
          <SearchBar
            value={busqueda}
            onChange={setBusqueda}
            onSubmit={(q) => setParams(q ? { q } : {})}
            onFilter={() => setFiltrosAbiertos(!filtrosAbiertos)}
            placeholder="Buscar..."
          />
          <div className={`galeria__panel ${filtrosAbiertos ? '' : 'galeria__panel--oculto'}`}>
            <div className="galeria__filter-section">
              <span className="galeria__label">MOTOR:</span>
              <div className="galeria__engine-radios">
                <label className="galeria__engine-opt">
                  <input
                    type="radio"
                    name="motor"
                    value="todos"
                    checked={motor === 'todos'}
                    onChange={() => setMotor('todos')}
                  />
                  <span className="galeria__radio-dot"></span>
                  <span className="galeria__engine-text">TODOS</span>
                </label>
                {MOTORES.filter((m) => m.id !== 'todos').map((m) => (
                  <label key={m.id} className="galeria__engine-opt" title={m.nombre}>
                    <input
                      type="radio"
                      name="motor"
                      value={m.id}
                      checked={motor === m.id}
                      onChange={() => setMotor(m.id)}
                    />
                    <span className="galeria__radio-dot"></span>
                    <img src={m.logo} alt={m.nombre} className="galeria__engine-logo" />
                  </label>
                ))}
              </div>
            </div>

            <div className="galeria__filter-section">
              <span className="galeria__label">ESTADO:</span>
              <div className="galeria__estado-tabs">
                {ESTADOS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className={`galeria__estado-btn ${estado === e.id ? 'galeria__estado-btn--active' : ''}`}
                    onClick={() => setEstado(e.id)}
                  >
                    {e.nombre.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section aria-live="polite">
          <p className="galeria__count">{resultados.length} proyectos encontrados</p>
          {resultados.length === 0 ? (
            <p className="card">No encontramos proyectos con esos filtros.</p>
          ) : (
            <div className="galeria__grid">
              {resultados.map((p) => (
                <ProjectCard key={p.id} proyecto={p} variant="grande" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Galeria
