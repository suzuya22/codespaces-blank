import { useState } from 'react'
import { Link } from 'react-router'
import AuthShell from '../../components/layout/AuthShell.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Button from '../../components/ui/Button/Button.jsx'

function Recuperar() {
  const [correo, setCorreo] = useState('')
  const [enviado, setEnviado] = useState(false)

  return (
    <AuthShell title="Recuperar contraseña">
      {enviado ? (
        <p className="auth__msg" role="status">
          Enviamos un código a <strong>{correo}</strong>. Revisa tu bandeja de entrada.
        </p>
      ) : (
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}
          onSubmit={(e) => {
            e.preventDefault()
            setEnviado(true)
          }}
        >
          <p className="muted" style={{ textAlign: 'center' }}>
            Escribe el correo con el que te registraste y te enviaremos un código.
          </p>
          <InputField label="Correo electrónico" type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <Button type="submit" full>
            Enviar código
          </Button>
        </form>
      )}
      <p className="auth__alt">
        Volver al <Link to="/login">login</Link>
      </p>
    </AuthShell>
  )
}

export default Recuperar
