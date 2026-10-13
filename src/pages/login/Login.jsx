import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AuthShell from '../../components/layout/AuthShell.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')

  // Primera versión: no hay backend, solo simulamos el ingreso
  const ingresar = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <AuthShell title="Datos de acceso">
      <form className="login__form" onSubmit={ingresar}>
        <InputField label="Correo electrónico" type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" />
        <InputField label="Contraseña" type="password" required value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" />
        <Button type="submit" full>
          Iniciar sesión
        </Button>
        <p className="auth__alt">
          ¿Olvidaste tu <Link to="/recuperar">contraseña</Link>?
        </p>
      </form>

      <p className="auth__divider">o continúa con</p>
      <div className="login__social">
        <Button variant="light" full onClick={() => navigate('/')}>
          <span className="login__g" aria-hidden="true">G</span> Inicia con Google
        </Button>
        <Button variant="light" full onClick={() => navigate('/')}>
          <span className="login__d" aria-hidden="true">◉</span> Inicia con Discord
        </Button>
      </div>
      <p className="auth__alt">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </AuthShell>
  )
}

export default Login
