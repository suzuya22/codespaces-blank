import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import SearchBar from '../../components/ui/SearchBar/SearchBar.jsx'
import Tag from '../../components/ui/Tag/Tag.jsx'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import { PROYECTOS, MOTORES, ESTADOS } from '../../data/proyectos.js'
import './Galeria.css'

// Explorar proyectos: búsqueda + filtros por motor y estado
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
      <h1 className="galeria__title">Explorar proyectos</h1>

      <div className="galeria__layout">
        <aside className="galeria__filtros">
          <SearchBar
            value={busqueda}
            onChange={setBusqueda}
            onSubmit={(q) => setParams(q ? { q } : {})}
            onFilter={() => setFiltrosAbiertos(!filtrosAbiertos)}
            placeholder="Buscar por nombre, autor o género"
          />
          <div className={`galeria__panel ${filtrosAbiertos ? '' : 'galeria__panel--oculto'}`}>
            <p className="galeria__label">Motor</p>
            <div className="galeria__chips">
              {MOTORES.map((m) => (
                <Tag key={m.id} active={motor === m.id} onClick={() => setMotor(m.id)}>
                  {m.nombre}
                </Tag>
              ))}
            </div>
            <p className="galeria__label">Estado</p>
            <div className="galeria__chips">
              {ESTADOS.map((e) => (
                <Tag key={e.id} active={estado === e.id} onClick={() => setEstado(e.id)}>
                  {e.nombre}
                </Tag>
              ))}
            </div>
          </div>
        </aside>

        <section aria-live="polite">
          <p className="muted galeria__count">{resultados.length} proyectos</p>
          {resultados.length === 0 ? (
            <p className="card">No encontramos proyectos con esos filtros.</p>
          ) : (
            <div className="galeria__grid">
              {resultados.map((p) => (
                <ProjectCard key={p.id} proyecto={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Galeria
