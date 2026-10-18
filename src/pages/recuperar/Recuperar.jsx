import { useState } from 'react'
import { Link } from 'react-router'
import AuthShell from '../../components/layout/AuthShell.jsx'
import InputField from '../../components/ui/InputField/InputField.jsx'
import Button from '../../components/ui/Button/Button.jsx'

function Recuperar() {
  const [correo, setCorreo] = useState('')
  const [enviado, setEnviado] = useState(false)

  return (
    <AuthShell title="RECUPERAR CONTRASEÑA">
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
          <InputField
            label="CORREO ELECTRÓNICO"
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="tu@correo.com"
          />
          <Button type="submit" full>
            ENVIAR CÓDIGO
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
