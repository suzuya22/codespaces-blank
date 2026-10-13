import { useState } from 'react'
import { Link } from 'react-router'
import AuthShell from '../../components/layout/AuthShell.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import './Registro.css'

const ROLES = ['Artista 2D / Pixel art', 'Animador 3D / Rigging', 'Compositor / SFX', 'Game designer', 'Programador']

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
        <InputField label="Usuario" required value={datos.usuario} onChange={cambiar('usuario')} autoComplete="username" />
        <InputField label="Correo electrónico" type="email" required value={datos.correo} onChange={cambiar('correo')} autoComplete="email" />
        <InputField label="Contraseña" type="password" required minLength={6} value={datos.clave} onChange={cambiar('clave')} autoComplete="new-password" hint="Mínimo 6 caracteres" />

        <fieldset className="registro__roles">
          <legend>Rol principal</legend>
          {ROLES.map((rol) => (
            <label key={rol} className="registro__opcion">
              <input type="radio" name="rol" value={rol} checked={datos.rol === rol} onChange={cambiar('rol')} />
              {rol}
            </label>
          ))}
        </fieldset>

        <label className="registro__opcion">
          <input type="checkbox" required checked={datos.terminos} onChange={cambiar('terminos')} />
          Acepto términos y condiciones
        </label>

        <Button type="submit" full>
          Registrarse
        </Button>
        <p className="auth__alt">
          ¿Ya tienes una <Link to="/login">cuenta</Link>?
        </p>
      </form>
    </AuthShell>
  )
}

export default Registro
