import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard.jsx'
import { USUARIOS } from '../../data/proyectos.js'
import { useProyectos } from '../../data/store.js'
import './Perfil.css'

function Perfil() {
  const { usuario } = useParams()
  const perfil = USUARIOS[usuario] || USUARIOS.suzuya
  const todos = useProyectos()
  const proyectos = todos.filter((p) => p.autor === perfil.usuario)
  const [activeTab, setActiveTab] = useState('proyectos')

  return (
    <div className="page perfil">
      {/* 1. Banner Panorámico de Portada (Idéntico a Wireframe) */}
      <div className="perfil__cover-wrapper">
        <img
          src={perfil.banner || 'images/banners/perfil-banner.png'}
          alt="Banner de perfil"
          className="perfil__cover-img"
        />
      </div>

      {/* 2. Cabecera de Identidad con Avatar Solapado e Insignias */}
      <div className="perfil__identity-header">
        <div className="perfil__identity-left">
          <div className="perfil__avatar-container">
            <img
              src={perfil.avatar || 'images/avatares/suzuya.png'}
              alt={perfil.nombre}
              className="perfil__avatar-img"
            />
            <span className="perfil__status-online" title="En línea"></span>
          </div>

          <div className="perfil__names-block">
            <div className="perfil__handle-row">
              <h1 className="perfil__handle">@{perfil.usuario.toUpperCase()}</h1>
              <span className="perfil__pronouns">{perfil.pronombres}</span>
            </div>
            <p className="perfil__role-title">{perfil.rol}</p>

            <div className="perfil__badges-strip">
              {perfil.insignias.map((insignia, i) => (
                <span key={i} className="perfil__badge-pill">
                  {i === 0 ? '🏆' : i === 1 ? '🛠️' : '🤝'} {insignia}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="perfil__identity-actions">
          <button type="button" className="perfil__action-btn perfil__action-btn--edit">
            ✏️ Editar perfil
          </button>
          <Link to="/mensajes" className="perfil__action-btn perfil__action-btn--msg">
            ✉️ Enviar mensaje
          </Link>
        </div>
      </div>

      {/* 3. Distribución en 2 Columnas Desktop (Sidebar Izquierda 340px + Portafolio Derecha) */}
      <div className="perfil__layout">
        {/* Columna Izquierda: Sobre Mí, Habilidades, Redes */}
        <aside className="perfil__sidebar">
          {/* Tarjeta Sobre Mí */}
          <div className="perfil__box">
            <h3 className="perfil__box-title">SOBRE MÍ</h3>
            <p className="perfil__box-text">{perfil.sobreMi}</p>
          </div>

          {/* Tarjeta Habilidades */}
          <div className="perfil__box">
            <h3 className="perfil__box-title">HABILIDADES &amp; HERRAMIENTAS</h3>
            <div className="perfil__skills-row">
              {perfil.habilidades.map((h) => (
                <span key={h} className="perfil__skill-chip">
                  [ {h} ]
                </span>
              ))}
            </div>
          </div>

          {/* Tarjeta Redes y Contacto */}
          <div className="perfil__box">
            <h3 className="perfil__box-title">REDES &amp; CONTACTO</h3>
            <ul className="perfil__social-list">
              <li>
                <span>💬</span> <span>Discord: <strong>{perfil.usuario}#0022</strong></span>
              </li>
              <li>
                <span>🎮</span> <span>Itch.io: <strong>{perfil.usuario}.itch.io</strong></span>
              </li>
              <li>
                <span>💻</span> <span>GitHub: <strong>github.com/{perfil.usuario}</strong></span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Columna Derecha: Pestañas de Contenido & Proyectos Publicados */}
        <main className="perfil__main">
          {/* Pestañas de Portafolio */}
          <div className="perfil__tabs-bar">
            <button
              type="button"
              className={`perfil__tab-btn ${activeTab === 'proyectos' ? 'perfil__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('proyectos')}
            >
              Proyectos publicados ({proyectos.length})
            </button>
            <button
              type="button"
              className={`perfil__tab-btn ${activeTab === 'assets' ? 'perfil__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('assets')}
            >
              Assets compartidos (4)
            </button>
            <button
              type="button"
              className={`perfil__tab-btn ${activeTab === 'feedbacks' ? 'perfil__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('feedbacks')}
            >
              Feedbacks otorgados (18)
            </button>
          </div>

          {/* Grid de Proyectos */}
          {activeTab === 'proyectos' && (
            <div className="perfil__projects-grid">
              {proyectos.map((p) => (
                <ProjectCard key={p.id} proyecto={p} variant="grande" />
              ))}
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="perfil__assets-info card">
              <p>Colección de recursos y spritesheets compartidos por @{perfil.usuario}.</p>
            </div>
          )}

          {activeTab === 'feedbacks' && (
            <div className="perfil__assets-info card">
              <p>Historial de playtesting y retroalimentación técnica enviada a otros creadores indie.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Perfil
