import { Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router'
import Button from '../../components/ui/Button/Button.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { Visor3D } from '../../components/ui/Visor3D/index.js'
import { MOTORES, ESTADOS } from '../../data/proyectos.js'
import { publicarProyecto } from '../../data/store.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { subirArchivo, validarArchivo, extension, formatoPeso, mensajeError, MODO } from '../../servicios/index.js'
import { FORMATOS_3D, MAX_MB, CLOUDINARY_LISTO } from '../../servicios/config.js'
import './Publicar.css'

// "2D" -> "2D", "CYBERPUNK" -> "Cyberpunk"
const formatoEtiqueta = (t) => (t.length <= 3 ? t : t.charAt(0) + t.slice(1).toLowerCase())
const ACEPTA_3D = FORMATOS_3D.map((f) => `.${f}`).join(',')

// URL temporal para previsualizar un archivo elegido (se libera al cambiarlo)
function useUrlLocal(file) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    if (!file) return setUrl(null)
    const u = URL.createObjectURL(file)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file])
  return url
}

function Publicar() {
  const { usuario, listo, cargando } = useAuth()
  const [titulo, setTitulo] = useState('')
  const [sinopsis, setSinopsis] = useState('')
  const [etiquetas, setEtiquetas] = useState(['3D', 'INDIE'])
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [motor, setMotor] = useState('unity')
  const [estado, setEstado] = useState('test')
  const [version, setVersion] = useState('Prototipo')
  const [enlaceJuego, setEnlaceJuego] = useState('')
  const [portada, setPortada] = useState(null)
  const [modelo, setModelo] = useState(null)
  const [error, setError] = useState('')
  const [progreso, setProgreso] = useState(null) // null | { paso, valor }
  const [publicadoId, setPublicadoId] = useState(null)

  const urlPortada = useUrlLocal(portada)
  const urlModelo = useUrlLocal(modelo)

  const elegirArchivo = (tipo, set) => (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      validarArchivo(file, tipo)
      setError('')
      set(file)
    } catch (err) {
      setError(`${mensajeError(err)} (${tipo === 'modelo' ? `formatos: ${FORMATOS_3D.join(', ').toUpperCase()}; ` : ''}máximo ${MAX_MB} MB)`)
    }
  }

  const agregarEtiqueta = (e) => {
    e.preventDefault()
    const t = nuevaEtiqueta.trim().toUpperCase()
    if (t && !etiquetas.includes(t) && etiquetas.length < 8) {
      setEtiquetas([...etiquetas, t])
      setNuevaEtiqueta('')
    }
  }

  const publicar = async (e) => {
    e.preventDefault()
    setError('')
    try {
      let datosPortada = null
      let datosModelo = null
      if (portada) {
        setProgreso({ paso: 'Subiendo portada', valor: 0 })
        datosPortada = await subirArchivo(portada, { tipo: 'imagen', onProgreso: (v) => setProgreso({ paso: 'Subiendo portada', valor: v }) })
      }
      if (modelo) {
        setProgreso({ paso: 'Subiendo modelo 3D', valor: 0 })
        const subido = await subirArchivo(modelo, { tipo: 'modelo', onProgreso: (v) => setProgreso({ paso: 'Subiendo modelo 3D', valor: v }) })
        datosModelo = { url: subido.url, formato: subido.formato, nombre: subido.nombre, bytes: subido.bytes }
      }
      setProgreso({ paso: 'Guardando proyecto', valor: 1 })
      const id = await publicarProyecto(
        {
          titulo,
          sinopsis,
          etiquetas: etiquetas.map(formatoEtiqueta),
          motor,
          estado,
          version,
          enlaceJuego,
          portada: datosPortada?.url ?? null,
          modelo: datosModelo,
        },
        usuario,
      )
      setPublicadoId(id)
    } catch (err) {
      setError(err?.detalle ? `${mensajeError(err)} (${err.detalle})` : mensajeError(err))
    } finally {
      setProgreso(null)
    }
  }

  const reiniciar = () => {
    setTitulo('')
    setSinopsis('')
    setPortada(null)
    setModelo(null)
    setEnlaceJuego('')
    setPublicadoId(null)
  }

  // Publicar requiere una cuenta
  if (!cargando && !listo) {
    return (
      <div className="page page--narrow publicar__gate">
        <h1>Publica tu proyecto</h1>
        <p className="muted">Necesitas una cuenta de DevNet para publicar prototipos, subir modelos 3D y recibir feedback.</p>
        <Button to="/login?volver=/publicar" full>
          Iniciar sesión
        </Button>
        <Button to="/registro?volver=/publicar" variant="ghost" full>
          Crear cuenta
        </Button>
      </div>
    )
  }

  if (publicadoId) {
    return (
      <div className="page page--narrow publicar__ok">
        <h1>¡Proyecto publicado!</h1>
        <p className="muted">
          “{titulo}” ya aparece como <strong>nuevo</strong> en Explorar y en tu perfil. Cualquier persona de la comunidad puede verlo y
          dejarte feedback.
        </p>
        <Button to={`/proyecto/${publicadoId}`} full>
          Ver mi proyecto
        </Button>
        <Button to="/galeria" variant="ghost" full>
          Ver en Explorar
        </Button>
        <Button variant="ghost" full onClick={reiniciar}>
          Publicar otro
        </Button>
      </div>
    )
  }

  const ocupado = Boolean(progreso)

  return (
    <form className="page publicar" onSubmit={publicar}>
      <h1 className="publicar__titulo-pagina">Publicar proyecto</h1>

      {/* Columna de archivos: portada + modelo 3D */}
      <div className="publicar__media">
        <div className="publicar__preview-container">
          <label className="publicar__preview-label">
            {urlPortada ? (
              <img src={urlPortada} alt="Vista previa de la portada" className="publicar__preview-img" />
            ) : (
              <div className="publicar__placeholder-box">
                <img src="images/proyectos/placeholder.png" alt="" className="publicar__placeholder-icon" />
                <span className="publicar__upload-hint">Haz clic para subir portada</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={elegirArchivo('imagen', setPortada)} disabled={ocupado} hidden />
          </label>
        </div>

        <div className="publicar__modelo">
          <div className="publicar__modelo-head">
            <span>Modelo 3D (opcional)</span>
            <small>{FORMATOS_3D.join(' · ').toUpperCase()} · máx. {MAX_MB} MB</small>
          </div>
          {modelo ? (
            <>
              <div className="publicar__modelo-visor">
                <Suspense fallback={<p className="publicar__modelo-cargando">Cargando visor 3D…</p>}>
                  <Visor3D url={urlModelo} formato={extension(modelo.name)} nombre={modelo.name} />
                </Suspense>
              </div>
              <div className="publicar__modelo-info">
                <span>
                  ◆ {modelo.name} · {formatoPeso(modelo.size)}
                </span>
                <button type="button" onClick={() => setModelo(null)} disabled={ocupado}>
                  Quitar
                </button>
              </div>
            </>
          ) : (
            <label className="publicar__build-drop">
              <Icon name="upload" size={20} />
              <span>Subir modelo 3D</span>
              <input type="file" accept={ACEPTA_3D} onChange={elegirArchivo('modelo', setModelo)} disabled={ocupado} />
            </label>
          )}
        </div>
      </div>

      {/* Columna de datos */}
      <div className="publicar__form-body">
        <div className="publicar__title-pill">
          <input
            type="text"
            required
            maxLength={80}
            placeholder="TÍTULO DEL PROYECTO"
            aria-label="Título del proyecto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="publicar__title-input"
          />
        </div>

        <div className="publicar__sinopsis-box">
          <textarea
            required
            rows={4}
            maxLength={2000}
            placeholder="SINOPSIS Y QUÉ FEEDBACK BUSCAS"
            aria-label="Sinopsis"
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            className="publicar__sinopsis-textarea"
          />
          <div className="publicar__tags-row">
            {etiquetas.map((tag) => (
              <button key={tag} type="button" className="publicar__tag-chip" onClick={() => setEtiquetas(etiquetas.filter((t) => t !== tag))} title="Quitar etiqueta">
                [ {tag} ✕ ]
              </button>
            ))}
            <input
              className="publicar__tag-input"
              value={nuevaEtiqueta}
              onChange={(e) => setNuevaEtiqueta(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarEtiqueta(e)}
              placeholder="+ etiqueta (Enter)"
              aria-label="Agregar etiqueta"
              maxLength={20}
            />
          </div>
        </div>

        <div className="publicar__engine-section">
          <div className="publicar__engine-radios" role="radiogroup" aria-label="Motor">
            {MOTORES.filter((m) => m.id !== 'todos').map((m) => (
              <label key={m.id} className="publicar__engine-opt" title={m.nombre}>
                <input type="radio" name="motor" value={m.id} checked={motor === m.id} onChange={() => setMotor(m.id)} />
                <span className="publicar__radio-dot"></span>
                <img src={m.logo} alt={m.nombre} className="publicar__engine-logo" />
              </label>
            ))}
          </div>
        </div>

        <div className="publicar__fila">
          <label className="publicar__campo">
            Estado
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              {ESTADOS.filter((e) => e.id !== 'todos').map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="publicar__campo">
            Versión
            <input value={version} maxLength={30} onChange={(e) => setVersion(e.target.value)} />
          </label>
        </div>

        <label className="publicar__campo">
          Enlace jugable (opcional)
          <input type="url" value={enlaceJuego} onChange={(e) => setEnlaceJuego(e.target.value)} placeholder="https://tu-usuario.itch.io/tu-juego" />
        </label>

        {error && (
          <p className="publicar__error" role="alert">
            {error}
          </p>
        )}

        {progreso && (
          <div className="publicar__progreso" role="status">
            <span>
              {progreso.paso}… {Math.round(progreso.valor * 100)}%
            </span>
            <div className="publicar__barra">
              <i style={{ width: `${progreso.valor * 100}%` }} />
            </div>
          </div>
        )}

        <button type="submit" className="publicar__submit-btn" disabled={ocupado}>
          {ocupado ? 'Publicando…' : 'Publicar proyecto'}
        </button>

        <p className="publicar__nota">
          Publicas como <Link to={`/perfil/${usuario?.usuario}`}>@{usuario?.usuario}</Link>
          {MODO === 'local' && ' · Modo local: solo se guarda en este navegador'}
          {MODO === 'firebase' && !CLOUDINARY_LISTO && ' · Falta configurar Cloudinary: los archivos no se guardarán'}
        </p>
      </div>
    </form>
  )
}

export default Publicar
