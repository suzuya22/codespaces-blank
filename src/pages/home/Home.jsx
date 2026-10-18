import { useState } from 'react'
import { useNavigate } from 'react-router'
import Tabs from '../../components/ui/Tabs/Tabs.jsx'
import SearchBar from '../../components/ui/SearchBar/SearchBar.jsx'
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import { PROYECTOS, ASSETS } from '../../data/proyectos.js'
import './Home.css'

const PESTANAS = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'nuevo', nombre: 'Nuevo' },
]

function Home() {
  const navigate = useNavigate()
  const [pestana, setPestana] = useState('destacados')
  const [busqueda, setBusqueda] = useState('')

  const juegos =
    pestana === 'nuevo' ? PROYECTOS.filter((p) => p.nuevo) : [...PROYECTOS].sort((a, b) => b.rating - a.rating)

  return (
    <div className="page home">
      <div className="home__top-nav">
        <Tabs tabs={PESTANAS} active={pestana} onChange={setPestana} label="Ordenar proyectos" />
      </div>
      
      <SearchBar 
        value={busqueda} 
        onChange={setBusqueda} 
        onSubmit={(q) => navigate(`/galeria?q=${encodeURIComponent(q)}`)}
        placeholder="Buscar..."
      />

      <section className="home__hero">
        <div className="home__hero-banner">
          <img 
            src="images/banners/hero-banner.png" 
            alt="Donde el desarrollo indie cobra vida" 
            className="home__hero-img" 
          />
          <div className="home__hero-action">
            <button 
              type="button" 
              className="home__hero-btn"
              onClick={() => navigate('/registro')}
            >
              UNIRME COMO CREADOR
            </button>
          </div>
        </div>
        <ul className="home__stats">
          <li>
            <strong>+1.2K</strong>
            <span>PROTOTIPOS</span>
          </li>
          <li>
            <strong>+450</strong>
            <span>EQUIPOS</span>
          </li>
          <li>
            <strong>+9.7K</strong>
            <span>FEEDBACKS</span>
          </li>
        </ul>
      </section>

      <section className="home__section">
        <SectionHeader title="VIDEOJUEGOS INDIE" to="/galeria" />
        <div className="home__scroller home__scroller--games">
          {juegos.map((p) => (
            <ProjectCard key={p.id} proyecto={p} variant="mini" />
          ))}
        </div>
      </section>

      <section className="home__section">
        <SectionHeader title="ASSETS ANIMADOS" to="/galeria" />
        <div className="home__scroller home__scroller--assets">
          {ASSETS.map((a) => (
            <article key={a.id} className="home__asset-card">
              <div className="home__asset-preview">
                <img src={a.imagen} alt={a.titulo} className="home__asset-img" loading="lazy" />
              </div>
              <div className="home__asset-info">
                <p className="home__asset-title">{a.titulo}</p>
                <small className="home__asset-author">@{a.autor}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
