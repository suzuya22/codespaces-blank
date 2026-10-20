import { useState } from 'react'
import { Link } from 'react-router'
import AuthShell from '../../components/layout/AuthShell.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import './Registro.css'

const ROLES = [
  'ARTISTA 2D / PIXEL ART',
  'ANIMADOR 3D / RIGGING',
  'COMPOSITOR / SFX',
  'GAME DESIGNER',
]

function Registro() {
  const [datos, setDatos] = useState({ usuario: '', correo: '', clave: '', rol: ROLES[0], terminos: false })
  const [listo, setListo] = useState(false)

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setDatos({ ...datos, [campo]: valor })
  }

  if (listo) {
    return (
      <AuthShell title="¡Cuenta creada!">
        <p className="auth__msg" role="status">
          Bienvenido a DevNet, <strong>@{datos.usuario}</strong>. Ya puedes publicar tu primer proyecto.
        </p>
        <Button to="/publicar" full>
          Publicar proyecto
        </Button>
        <Button to="/galeria" variant="ghost" full>
          Explorar proyectos
        </Button>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Datos de acceso">
      <form
        className="registro__form"
        onSubmit={(e) => {
          e.preventDefault()
          setListo(true)
        }}
      >
        <InputField
          label="USUARIO"
          required
          value={datos.usuario}
          onChange={cambiar('usuario')}
          autoComplete="username"
          placeholder="tu_usuario"
        />
        <InputField
          label="CORREO ELECTRÓNICO"
          type="email"
          required
          value={datos.correo}
          onChange={cambiar('correo')}
          autoComplete="email"
          placeholder="tu@correo.com"
        />
        <InputField
          label="CONTRASEÑA"
          type="password"
          required
          minLength={6}
          value={datos.clave}
          onChange={cambiar('clave')}
          autoComplete="new-password"
          placeholder="••••••••"
        />

        <fieldset className="registro__roles">
          <legend className="registro__legend">ROL PRINCIPAL</legend>
          <div className="registro__roles-list">
            {ROLES.map((rol) => (
              <label key={rol} className="registro__opcion">
                <input
                  type="radio"
                  name="rol"
                  value={rol}
                  checked={datos.rol === rol}
                  onChange={cambiar('rol')}
                />
                <span className="registro__radio-dot"></span>
                <span className="registro__rol-text">{rol}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="registro__terminos">
          <input
            type="checkbox"
            required
            checked={datos.terminos}
            onChange={cambiar('terminos')}
          />
          <span className="registro__check-box"></span>
          <span className="registro__terminos-text">ACEPTO TÉRMINOS Y CONDICIONES</span>
        </label>

        <Button type="submit" full>
          Registrarse
        </Button>

        <p className="auth__alt">
          ¿YA TIENES UNA <Link to="/login">CUENTA?</Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default Registro
