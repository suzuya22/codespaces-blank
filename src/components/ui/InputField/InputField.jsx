import { useId } from 'react'
import './InputField.css'

// Campo de formulario con etiqueta accesible. Soporta "textarea".
export default function InputField({ label, as = 'input', hint, ...props }) {
  const id = useId()
  const Campo = as
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <Campo id={id} className="field__control" {...props} />
      {hint && <small className="field__hint">{hint}</small>}
    </div>
  )
}
