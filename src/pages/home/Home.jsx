import { useState } from 'react'
import { useNavigate } from 'react-router'
import Tabs from '../../components/ui/Tabs/Tabs.jsx'
import SearchBar from '../../components/ui/SearchBar/SearchBar.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import { PixelCover } from '../../components/ui/PixelArt.jsx'
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
      <Tabs tabs={PESTANAS} active={pestana} onChange={setPestana} label="Ordenar proyectos" />
      <SearchBar value={busqueda} onChange={setBusqueda} onSubmit={(q) => navigate(`/galeria?q=${encodeURIComponent(q)}`)} />

      <section className="home__hero">
        <div className="home__hero-text">
          <h1 className="pixel">Donde el desarrollo indie cobra vida</h1>
          <p className="muted">Comparte prototipos, recibe feedback real y encuentra tu equipo.</p>
          <Button to="/registro">Unirme como creador</Button>
        </div>
        <div className="home__hero-art">
          <PixelCover seed="devnet-hero" palette={['#1a0f2e', '#3d0f7a', '#8668e6', '#f2c14e']} />
        </div>
        <ul className="home__stats">
          <li>
            <strong>+1.2k</strong> prototipos
          </li>
          <li>
            <strong>+450</strong> equipos
          </li>
          <li>
            <strong>+97k</strong> feedbacks
          </li>
        </ul>
      </section>

      <section>
        <SectionHeader title="Videojuegos indie" to="/galeria" />
        <div className="home__scroller home__scroller--games">
          {juegos.map((p) => (
            <ProjectCard key={p.id} proyecto={p} variant="mini" />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Assets animados" to="/galeria" />
        <div className="home__scroller home__scroller--assets">
          {ASSETS.map((a) => (
            <article key={a.id} className="home__asset">
              <PixelCover seed={a.id} palette={a.paleta} className="home__asset-img" />
              <p>{a.titulo}</p>
              <small className="muted">@{a.autor}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
