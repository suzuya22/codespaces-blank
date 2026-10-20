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

  const ingresar = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <AuthShell title="Datos de acceso">
      <form className="login__form" onSubmit={ingresar}>
        <InputField
          label="CORREO ELECTRÓNICO"
          type="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          autoComplete="email"
          placeholder="tu@correo.com"
        />
        <InputField
          label="CONTRASEÑA"
          type="password"
          required
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          autoComplete="current-password"
          placeholder="••••••••"
        />
        <Button type="submit" full>
          Iniciar sesión
        </Button>
        <p className="auth__alt">
          ¿OLVIDASTE TU <Link to="/recuperar">CONTRASEÑA?</Link>
        </p>
      </form>

      <div className="login__social">
        <button type="button" className="login__social-btn" onClick={() => navigate('/')}>
          <img src="images/logos/google.png" alt="Google" className="login__social-icon" />
          <span>Inicia con Google</span>
        </button>
        <button type="button" className="login__social-btn" onClick={() => navigate('/')}>
          <img src="images/logos/discord.png" alt="Discord" className="login__social-icon" />
          <span>Inicia con Discord</span>
        </button>
      </div>

      <p className="auth__alt">
        ¿NO TIENES CUENTA? <Link to="/registro">REGÍSTRATE</Link>
      </p>
    </AuthShell>
  )
}

export default Login
