import { useState } from 'react'
import { Link } from 'react-router'
import AuthShell from '../../components/layout/AuthShell.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Button from '../../components/ui/Button/Button.jsx'
import { useAuth } from '../../auth/AuthContext.jsx'
import { mensajeError, MODO } from '../../servicios/index.js'

function Recuperar() {
  const { recuperarClave } = useAuth()
  const [correo, setCorreo] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await recuperarClave(correo.trim())
      setEnviado(true)
    } catch (err) {
      // Por seguridad no se revela si el correo existe o no
      if (err?.code === 'auth/user-not-found') setEnviado(true)
      else setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthShell title="RECUPERAR CONTRASEÑA">
      {enviado ? (
        <p className="auth__msg" role="status">
          {MODO === 'firebase' ? (
            <>
              Si existe una cuenta con <strong>{correo}</strong>, te enviamos un enlace para crear una contraseña nueva. Revisa también
              la carpeta de spam.
            </>
          ) : (
            <>En modo local no se envían correos. Configura Firebase para activar la recuperación de contraseña.</>
          )}
        </p>
      ) : (
        <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }} onSubmit={enviar}>
          <InputField label="CORREO ELECTRÓNICO" type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tu@correo.com" />
          {error && (
            <p className="auth__error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" full disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar enlace'}
          </Button>
        </form>
      )}
      <p className="auth__alt">
        VOLVER AL <Link to="/login">LOGIN</Link>
      </p>
    </AuthShell>
  )
}

export default Recuperar
