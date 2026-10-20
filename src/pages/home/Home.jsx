import { useState } from 'react'
import { useNavigate } from 'react-router'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx'
import { ASSETS } from '../../data/proyectos.js'
import { useProyectos } from '../../data/store.js'
import './Home.css'

const CATEGORIAS = [
  { id: 'destacados', label: '★ Destacados' },
  { id: 'nuevo', label: '✦ Nuevos' },
  { id: 'populares', label: '🔥 Populares' },
  { id: 'equipo', label: '👥 Buscando equipo' },
]

function Home() {
  const navigate = useNavigate()
  const [categoria, setCategoria] = useState('destacados')
  const proyectos = useProyectos()
  const tendencia = proyectos.find((p) => p.id === 'bit-scape')

  let juegos = [...proyectos]
  if (categoria === 'nuevo') {
    juegos = juegos.filter((p) => p.nuevo).sort((a, b) => (b.creadoEn ?? 0) - (a.creadoEn ?? 0))
  } else if (categoria === 'equipo') {
    juegos = juegos.filter((p) => p.estado === 'equipo')
  } else if (categoria === 'populares') {
    juegos = juegos.sort((a, b) => b.feedbacks - a.feedbacks)
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

      {/* 2. Hero Section Principal (DevNet Banner + CTAs + Métricas) */}
      <section className="home__hero">
        <div className="home__hero-top-row">
          <span className="home__hero-badge">COMUNIDAD &amp; PROTOTIPADO INDIE</span>
        </div>

        <div className="home__hero-banner-wrap">
          <img
            src="images/banners/hero-banner.png"
            alt="Donde el desarrollo indie cobra vida - DevNet"
            className="home__hero-banner-img"
          />
        </div>

        <div className="home__hero-footer">
          <div className="home__hero-pitch">
            <h1 className="home__hero-title">Sube tu prototipo, recibe feedback real y arma tu equipo indie.</h1>
            <p className="home__hero-text">
              Juega demos WebGL directamente en el navegador, deja reseñas a otros creadores y encuentra
              artistas, programadores y músicos para tu próximo proyecto.
            </p>
          </div>
          <div className="home__hero-ctas">
            <button
              type="button"
              className="home__cta-btn home__cta-btn--primary"
              onClick={() => navigate('/registro')}
            >
              ＋ Unirme como creador
            </button>
            <button
              type="button"
              className="home__cta-btn home__cta-btn--outline"
              onClick={() => navigate('/galeria')}
            >
              🎮 Explorar prototipos
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
      </section>

      {/* 3. Juego Trending Spotlight (después de la sección principal) */}
      <section className="home__spotlight-section">
        <div className="home__spotlight-header">
          <div className="home__spotlight-label-wrap">
            <span className="home__live-dot home__live-dot--fire" />
            <h2 className="home__spotlight-heading">PLAYTEST EN TENDENCIA</h2>
            <span className="home__spotlight-chip">🔥 #1 HOT TRENDING</span>
          </div>
          <span className="home__spotlight-hint">Prototipo destacado por la comunidad esta semana</span>
        </div>

        <article className="home__spotlight-card" onClick={() => navigate('/proyecto/bit-scape')}>
          <div className="home__spotlight-media">
            <img
              src="images/proyectos/bit-scape.png"
              alt="Bit Scape - Demo Playtest"
              className="home__spotlight-img"
            />
            <span className="home__featured-badge home__featured-badge--trending">
              🔥 HOT TRENDING
            </span>
            <span className="home__featured-badge home__featured-badge--play">
              ▶ DEMO WEBGL JUGABLE
            </span>
          </div>

          <div className="home__spotlight-info">
            <div className="home__featured-tags">
              <span className="home__tag home__tag--fire">🔥 EN TENDENCIA</span>
              <span className="home__tag">UNITY</span>
              <span className="home__tag">DEMO V0.1</span>
              <span className="home__tag">ARCADE 2D</span>
              <span className="home__tag">MÓVIL</span>
            </div>

            <h3 className="home__spotlight-title">BIT SCAPE: CYBER ESCAPE</h3>
            <p className="home__spotlight-desc">
              Arcade de escape en una red de datos cibernética. Diseñado para pantalla vertical móvil y partidas rápidas. ¡Pruébalo directamente en el navegador y apoya al creador con tu feedback!
            </p>

            <div className="home__spotlight-meta-row">
              <div className="home__spotlight-author">
                <img src="images/avatares/avatar-3.png" alt="pixelnauta" className="home__spotlight-avatar" />
                <div>
                  <span className="home__spotlight-author-name">@pixelnauta</span>
                  <span className="home__spotlight-author-role">Desarrollador Arcade</span>
                </div>
              </div>
              <div className="home__spotlight-stats">
                <span className="home__spotlight-stat">⭐ <strong>{tendencia?.rating.toFixed(1)}</strong> / 5</span>
                <span className="home__spotlight-stat">💬 <strong>{tendencia?.feedbacks}</strong> Feedbacks</span>
              </div>
            </div>

            <div className="home__spotlight-cta-wrap">
              <button
                type="button"
                className="home__spotlight-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/proyecto/bit-scape')
                }}
              >
                🎮 Probar playtest (WebGL) ➔
              </button>
            </div>
          </div>
        </article>
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
