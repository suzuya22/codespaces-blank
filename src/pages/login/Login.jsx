import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import AuthShell from '../../components/layout/AuthShell.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import { useAuth } from '../../auth/AuthContext.jsx'
import { mensajeError, MODO } from '../../servicios/index.js'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const volver = params.get('volver') || '/'
  const { ingresar, ingresarConGoogle } = useAuth()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const ejecutar = async (accion) => {
    setError('')
    setEnviando(true)
    try {
      await accion()
      navigate(volver, { replace: true })
    } catch (e) {
      setError(mensajeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthShell title="Datos de acceso">
      <form
        className="login__form"
        onSubmit={(e) => {
          e.preventDefault()
          ejecutar(() => ingresar(correo, clave))
        }}
      >
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
        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" full disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
        <p className="auth__alt">
          ¿OLVIDASTE TU <Link to="/recuperar">CONTRASEÑA?</Link>
        </p>
      </form>

      {MODO === 'firebase' && (
        <div className="login__social">
          <button type="button" className="login__social-btn" disabled={enviando} onClick={() => ejecutar(ingresarConGoogle)}>
            <img src="images/logos/google.png" alt="" className="login__social-icon" />
            <span>Inicia con Google</span>
          </button>
        </div>
      )}

      <p className="auth__alt">
        ¿NO TIENES CUENTA? <Link to={`/registro${volver !== '/' ? `?volver=${encodeURIComponent(volver)}` : ''}`}>REGÍSTRATE</Link>
      </p>
    </AuthShell>
  )
}

export default Login
