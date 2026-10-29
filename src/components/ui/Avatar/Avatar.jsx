import { PixelAvatar } from '../PixelArt.jsx'
import { USUARIOS } from '../../../data/proyectos.js'

// Foto de perfil: usa la imagen subida por el usuario o, si no tiene, un avatar pixelado único
export default function Avatar({ perfil, usuario, size = 40, className = '' }) {
  const datos = perfil ?? USUARIOS[usuario] ?? { usuario }
  const nombre = datos.usuario ?? usuario ?? 'devnet'
  const estilo = { width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }
  if (datos.avatar) return <img src={datos.avatar} alt={`Avatar de @${nombre}`} className={className} style={estilo} />
  return (
    <span className={className} style={{ ...estilo, display: 'inline-block', overflow: 'hidden' }} role="img" aria-label={`Avatar de @${nombre}`}>
      <PixelAvatar seed={nombre} size={size} />
    </span>
  )
}
