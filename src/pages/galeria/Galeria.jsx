import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { MOTORES, ESTADOS } from '../../data/proyectos.js'
import { useProyectos } from '../../data/store.js'
import './Galeria.css'

function Galeria() {
  const proyectos = useProyectos()
  const [params, setParams] = useSearchParams()
  const [busqueda, setBusqueda] = useState(params.get('q') ?? '')
  const [motor, setMotor] = useState('todos')
  const [estado, setEstado] = useState('todos')
  const [orden, setOrden] = useState('recientes')
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true)

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    let lista = proyectos.filter((p) => {
      const coincide = !q || [p.titulo, p.autor, ...p.generos].join(' ').toLowerCase().includes(q)
      return coincide && (motor === 'todos' || p.motor === motor) && (estado === 'todos' || p.estado === estado)
    })

    if (orden === 'recientes') {
      // Los proyectos recién publicados (con fecha) quedan de primeros
      lista.sort((a, b) => (b.creadoEn ?? 0) - (a.creadoEn ?? 0))
    } else if (orden === 'feedbacks') {
      lista.sort((a, b) => b.feedbacks - a.feedbacks)
    } else if (orden === 'rating') {
      lista.sort((a, b) => b.rating - a.rating)
    }

    return lista
  }, [proyectos, busqueda, motor, estado, orden])

  const limpiarFiltros = () => {
    setBusqueda('')
    setMotor('todos')
    setEstado('todos')
    setOrden('recientes')
    setParams({})
  }

  return (
    <div className="page galeria">
      {/* 1. Header Strip con Buscador y Selector de Orden (Idéntico a Wireframe) */}
      <div className="galeria__header-strip">
        <div className="galeria__header-text">
          <h1 className="galeria__title">EXPLORAR PROYECTOS &amp; PROTOTIPOS</h1>
          <p className="galeria__subtitle">
            Encuentra prototipos jugables en desarrollo por motor, rol requerido o estado de madurez
          </p>
        </div>

        <div className="galeria__header-actions">
          <div className="galeria__search-box">
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre, tag o creador..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value)
                setParams(e.target.value ? { q: e.target.value } : {})
              }}
              aria-label="Buscar en galería"
            />
          </div>

          <div className="galeria__sort-box">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              aria-label="Ordenar proyectos"
              className="galeria__sort-select"
            >
              <option value="recientes">Ordenar: Más Recientes ▾</option>
              <option value="rating">Más Votados</option>
              <option value="feedbacks">Más Feedbacks</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Layout Desktop en 2 Columnas (Sidebar 280px + Grid de 3 Columnas) */}
      <div className="galeria__layout">
        {/* Sidebar Izquierda de Filtros */}
        <aside className="galeria__sidebar">
          <div className="galeria__panel">
            <div className="galeria__panel-header">
              <span className="galeria__panel-title">FILTROS DE BÚSQUEDA</span>
              <button
                type="button"
                className="galeria__panel-toggle"
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
              >
                {filtrosAbiertos ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <div className={`galeria__panel-body ${filtrosAbiertos ? '' : 'galeria__panel-body--hidden'}`}>
              {/* Filtro: Motor */}
              <div className="galeria__filter-group">
                <h4 className="galeria__filter-heading">MOTOR DE DESARROLLO</h4>
                <div className="galeria__engine-list">
                  <label className="galeria__check-item">
                    <input
                      type="radio"
                      name="motor"
                      value="todos"
                      checked={motor === 'todos'}
                      onChange={() => setMotor('todos')}
                    />
                    <span className="galeria__radio-custom"></span>
                    <span>Todos los motores ({proyectos.length})</span>
                  </label>
                  {MOTORES.filter((m) => m.id !== 'todos').map((m) => {
                    const cant = proyectos.filter((p) => p.motor === m.id).length
                    return (
                      <label key={m.id} className="galeria__check-item">
                        <input
                          type="radio"
                          name="motor"
                          value={m.id}
                          checked={motor === m.id}
                          onChange={() => setMotor(m.id)}
                        />
                        <span className="galeria__radio-custom"></span>
                        <img src={m.logo} alt={m.nombre} className="galeria__mini-logo" />
                        <span>{m.nombre} ({cant})</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Filtro: Estado */}
              <div className="galeria__filter-group">
                <h4 className="galeria__filter-heading">ESTADO DEL PROYECTO</h4>
                <div className="galeria__estado-options">
                  <button
                    type="button"
                    className={`galeria__pill-state ${estado === 'todos' ? 'galeria__pill-state--active' : ''}`}
                    onClick={() => setEstado('todos')}
                  >
                    Todos
                  </button>
                  {ESTADOS.filter((e) => e.id !== 'todos').map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      className={`galeria__pill-state ${estado === e.id ? 'galeria__pill-state--active' : ''}`}
                      onClick={() => setEstado(e.id)}
                    >
                      {e.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acciones de filtro */}
              <div className="galeria__filter-actions">
                <button
                  type="button"
                  className="galeria__btn-clear"
                  onClick={limpiarFiltros}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido Principal: Grid de 3 Columnas en Desktop */}
        <main className="galeria__results">
          <div className="galeria__results-meta">
            <span className="galeria__count">
              Mostrando <strong>{resultados.length}</strong> de <strong>{proyectos.length}</strong> proyectos
            </span>
            {(motor !== 'todos' || estado !== 'todos' || busqueda) && (
              <button type="button" className="galeria__reset-tag" onClick={limpiarFiltros}>
                Restablecer filtros ✕
              </button>
            )}
          </div>

          {resultados.length === 0 ? (
            <div className="galeria__empty card">
              <p>No se encontraron proyectos con los filtros seleccionados.</p>
              <button type="button" className="galeria__btn-clear" onClick={limpiarFiltros}>
                Ver todos los proyectos
              </button>
            </div>
          ) : (
            <div className="galeria__grid">
              {resultados.map((p) => (
                <ProjectCard key={p.id} proyecto={p} variant="grande" />
              ))}
            </div>
          )}

          {/* Barra de Paginación Esquemática (Idéntica al Wireframe) */}
          <div className="galeria__pagination">
            <button type="button" className="galeria__page-btn galeria__page-btn--arrow" disabled>
              ← Anterior
            </button>
            <button type="button" className="galeria__page-btn galeria__page-btn--active">
              1
            </button>
            <button type="button" className="galeria__page-btn">
              2
            </button>
            <button type="button" className="galeria__page-btn">
              3
            </button>
            <span className="galeria__page-dots">...</span>
            <button type="button" className="galeria__page-btn">
              8
            </button>
            <button type="button" className="galeria__page-btn galeria__page-btn--arrow">
              Siguiente →
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Galeria
