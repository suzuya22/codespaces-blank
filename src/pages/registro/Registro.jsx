import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import AuthShell from '../../components/layout/AuthShell.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import { useAuth } from '../../auth/AuthContext.jsx'
import { mensajeError, normalizarUsuario } from '../../servicios/index.js'
import './Registro.css'

const ROLES = ['ARTISTA 2D / PIXEL ART', 'ANIMADOR 3D / RIGGING', 'COMPOSITOR / SFX', 'GAME DESIGNER', 'PROGRAMADOR']

function Registro() {
  const { registrar } = useAuth()
  const [params] = useSearchParams()
  const volver = params.get('volver')
  const [datos, setDatos] = useState({ nombre: '', usuario: '', correo: '', clave: '', rol: ROLES[0], terminos: false })
  const [creado, setCreado] = useState(null)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setDatos({ ...datos, [campo]: valor })
  }

  const usuarioLimpio = normalizarUsuario(datos.usuario)

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    if (usuarioLimpio.length < 3) return setError(mensajeError({ code: 'usuario-invalido' }))
    setEnviando(true)
    try {
      const rol = datos.rol.charAt(0) + datos.rol.slice(1).toLowerCase()
      await registrar({ correo: datos.correo.trim(), clave: datos.clave, usuario: usuarioLimpio, nombre: datos.nombre.trim(), rol })
      setCreado(usuarioLimpio)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  if (creado) {
    return (
      <AuthShell title="¡Cuenta creada!">
        <p className="auth__msg" role="status">
          Bienvenido a DevNet, <strong>@{creado}</strong>. Ya puedes publicar tu primer proyecto.
        </p>
        <Button to={volver || '/publicar'} full>
          {volver ? 'Continuar' : 'Publicar proyecto'}
        </Button>
        <Button to={`/perfil/${creado}`} variant="ghost" full>
          Ver mi perfil
        </Button>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Crear cuenta">
      <form className="registro__form" onSubmit={enviar}>
        <InputField label="NOMBRE" required maxLength={40} value={datos.nombre} onChange={cambiar('nombre')} autoComplete="name" placeholder="Cómo quieres que te vean" />
        <InputField
          label="USUARIO"
          required
          value={datos.usuario}
          onChange={cambiar('usuario')}
          autoComplete="username"
          placeholder="tu_usuario"
          hint={datos.usuario && usuarioLimpio !== datos.usuario ? `Se guardará como @${usuarioLimpio}` : 'Letras, números y _ (3 a 20)'}
        />
        <InputField label="CORREO ELECTRÓNICO" type="email" required value={datos.correo} onChange={cambiar('correo')} autoComplete="email" placeholder="tu@correo.com" />
        <InputField
          label="CONTRASEÑA"
          type="password"
          required
          minLength={6}
          value={datos.clave}
          onChange={cambiar('clave')}
          autoComplete="new-password"
          placeholder="••••••••"
          hint="Mínimo 6 caracteres"
        />

        <fieldset className="registro__roles">
          <legend className="registro__legend">ROL PRINCIPAL</legend>
          <div className="registro__roles-list">
            {ROLES.map((rol) => (
              <label key={rol} className="registro__opcion">
                <input type="radio" name="rol" value={rol} checked={datos.rol === rol} onChange={cambiar('rol')} />
                <span className="registro__radio-dot"></span>
                <span className="registro__rol-text">{rol}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="registro__terminos">
          <input type="checkbox" required checked={datos.terminos} onChange={cambiar('terminos')} />
          <span className="registro__check-box"></span>
          <span className="registro__terminos-text">ACEPTO TÉRMINOS Y CONDICIONES</span>
        </label>

        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" full disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Registrarse'}
        </Button>

        <p className="auth__alt">
          ¿YA TIENES UNA <Link to="/login">CUENTA?</Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default Registro
