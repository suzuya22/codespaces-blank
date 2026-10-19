import { useState } from 'react'
import { useNavigate } from 'react-router'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx'
import { PROYECTOS, ASSETS } from '../../data/proyectos.js'
import './Home.css'

const CATEGORIAS = [
  { id: 'destacados', label: '★ DESTACADOS' },
  { id: 'nuevo', label: '✦ NUEVOS' },
  { id: 'populares', label: '🔥 POPULARES' },
  { id: 'equipo', label: '👥 BUSCANDO EQUIPO' },
]

function Home() {
  const navigate = useNavigate()
  const [categoria, setCategoria] = useState('destacados')

  let juegos = [...PROYECTOS]
  if (categoria === 'nuevo') {
    juegos = juegos.filter((p) => p.nuevo)
  } else if (categoria === 'equipo') {
    juegos = juegos.filter((p) => p.estado === 'equipo')
  } else {
    juegos = juegos.sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="page home">
      {/* 1. Barra de Vistas / Filtros Rápidos (Idéntica a Wireframe) */}
      <div className="home__vistas-bar">
        <div className="home__pills-row" role="tablist" aria-label="Categorías principales">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`home__pill-btn ${categoria === cat.id ? 'home__pill-btn--active' : ''}`}
              onClick={() => setCategoria(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="home__live-ticker">
          <span className="home__live-dot"></span>
          <span><strong>142</strong> Playtests activos hoy</span>
        </div>
      </div>

      {/* 2. Hero Section en Split Desktop (Izquierda: Copy + CTAs + Métricas / Derecha: Card Destacada) */}
      <section className="home__hero-split">
        <div className="home__hero-left">
          <span className="home__hero-badge">COMUNIDAD &amp; PROTOTIPADO INDIE</span>
          <h1 className="home__hero-heading">
            DONDE EL DESARROLLO INDIE COBRA VIDA
          </h1>
          <p className="home__hero-lead">
            Comparte prototipos en fases tempranas (Alpha/Beta), recibe retroalimentación técnica de otros desarrolladores y recluta talento para completar tu equipo.
          </p>

          <div className="home__hero-ctas">
            <button
              type="button"
              className="home__cta-btn home__cta-btn--primary"
              onClick={() => navigate('/registro')}
            >
              ＋ UNIRME COMO CREADOR
            </button>
            <button
              type="button"
              className="home__cta-btn home__cta-btn--outline"
              onClick={() => navigate('/galeria')}
            >
              🎮 EXPLORAR PROTOTIPOS
            </button>
          </div>

          <div className="home__hero-metrics">
            <div className="home__metric-card">
              <span className="home__metric-val">+1.2K</span>
              <span className="home__metric-lbl">PROTOTIPOS SUBIDOS</span>
            </div>
            <div className="home__metric-card">
              <span className="home__metric-val">+450</span>
              <span className="home__metric-lbl">EQUIPOS FORMADOS</span>
            </div>
            <div className="home__metric-card">
              <span className="home__metric-val">+9.7K</span>
              <span className="home__metric-lbl">FEEDBACKS REGISTRADOS</span>
            </div>
          </div>
        </div>

        {/* Tarjeta destacada en Desktop (conservando la imagen hero-banner.png) */}
        <div className="home__hero-right">
          <article className="home__featured-card" onClick={() => navigate('/proyecto/bit-scape')}>
            <div className="home__featured-media">
              <img
                src="images/banners/hero-banner.png"
                alt="Bit Scape Destacado"
                className="home__featured-img"
              />
              <span className="home__featured-badge">▶ DEMO WEBGL JUGABLE</span>
            </div>
            <div className="home__featured-meta">
              <div className="home__featured-tags">
                <span className="home__tag">UNITY 6</span>
                <span className="home__tag">ALPHA V0.3</span>
                <span className="home__tag">CYBERPUNK</span>
              </div>
              <h3 className="home__featured-title">BIT SCAPE: CYBER RUNNER</h3>
              <div className="home__featured-foot">
                <span>Por <strong>@Suzuya</strong> · Plataformas 2D</span>
                <span className="home__featured-fb">💬 18 Feedbacks</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Sección: Videojuegos Indie (Grid Desktop 4-cols / Scroller Móvil) */}
      <section className="home__section">
        <SectionHeader title="VIDEOJUEGOS INDIE" to="/galeria" />
        <div className="home__grid home__grid--games">
          {juegos.map((p) => (
            <ProjectCard key={p.id} proyecto={p} variant="grande" />
          ))}
        </div>
      </section>

      {/* 4. Sección: Assets Animados & Recursos */}
      <section className="home__section">
        <SectionHeader title="ASSETS ANIMADOS &amp; RECURSOS" to="/galeria" />
        <div className="home__grid home__grid--assets">
          {ASSETS.map((a) => (
            <article key={a.id} className="home__asset-card">
              <div className="home__asset-preview">
                <img src={a.imagen} alt={a.titulo} className="home__asset-img" loading="lazy" />
              </div>
              <div className="home__asset-info">
                <div className="home__tag-wrap">
                  <span className="home__tag">PIXEL ART</span>
                </div>
                <p className="home__asset-title">{a.titulo}</p>
                <div className="home__asset-sub">
                  <small className="home__asset-author">@{a.autor}</small>
                  <small className="home__asset-lic">CC-BY 4.0</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
