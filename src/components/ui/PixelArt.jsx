// Arte pixelado generado por código: portadas, avatares y cielo del banner.
// Así el sitio no depende de imágenes con derechos de autor.
import { useMemo } from 'react'

function semilla(texto) {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 10000) / 10000
  }
}

// Convierte una matriz de colores en rectángulos (agrupando por filas)
function aRects(grid) {
  const rects = []
  grid.forEach((fila, y) => {
    let x = 0
    while (x < fila.length) {
      const color = fila[x]
      let w = 1
      while (x + w < fila.length && fila[x + w] === color) w++
      if (color) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={color} />)
      x += w
    }
  })
  return rects
}

/* ---------- Portada de proyecto ---------- */
export function PixelCover({ seed, palette, className = '', label }) {
  const rects = useMemo(() => {
    const W = 32
    const H = 20
    const rnd = semilla(seed)
    const [fondo, medio, acento, luz] = palette
    const grid = Array.from({ length: H }, () => Array(W).fill(fondo))

    // estrellas
    for (let i = 0; i < 14; i++) {
      const x = Math.floor(rnd() * W)
      const y = Math.floor(rnd() * 8)
      grid[y][x] = luz
    }
    // luna / sol
    const lx = 4 + Math.floor(rnd() * 22)
    for (let y = 1; y < 5; y++)
      for (let x = lx; x < lx + 4; x++) if (!((y === 1 || y === 4) && (x === lx || x === lx + 3))) grid[y][x] = acento

    // montañas
    let alto = 9 + Math.floor(rnd() * 3)
    for (let x = 0; x < W; x++) {
      alto += Math.floor(rnd() * 3) - 1
      alto = Math.max(6, Math.min(12, alto))
      for (let y = alto; y < 14; y++) grid[y][x] = medio
    }
    // suelo
    for (let y = 14; y < H; y++) for (let x = 0; x < W; x++) grid[y][x] = (x + y) % 5 === 0 ? acento : fondo
    for (let x = 0; x < W; x++) grid[14][x] = acento

    // personaje
    const px = 8 + Math.floor(rnd() * 14)
    const sprite = ['.LL.', 'LAAL', '.LL.', 'L..L']
    sprite.forEach((fila, dy) =>
      [...fila].forEach((c, dx) => {
        if (c === 'L') grid[10 + dy][px + dx] = luz
        if (c === 'A') grid[10 + dy][px + dx] = acento
      }),
    )
    return aRects(grid)
  }, [seed, palette])

  return (
    <svg
      className={className}
      viewBox="0 0 32 20"
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rects}
    </svg>
  )
}

/* ---------- Avatar tipo identicon ---------- */
const COLORES_AVATAR = ['#f2c14e', '#e04f6c', '#4fd1c5', '#9bd16a', '#8668e6', '#f08a24', '#6d7cff']

export function PixelAvatar({ seed, size = 44, className = '' }) {
  const rects = useMemo(() => {
    const rnd = semilla(seed)
    const color = COLORES_AVATAR[Math.floor(rnd() * COLORES_AVATAR.length)]
    const grid = Array.from({ length: 8 }, () => Array(8).fill('#2a2140'))
    for (let y = 1; y < 7; y++)
      for (let x = 1; x < 4; x++) {
        if (rnd() > 0.45) {
          grid[y][x] = color
          grid[y][7 - x] = color
        }
      }
    grid[3][2] = '#121016'
    grid[3][5] = '#121016'
    return aRects(grid)
  }, [seed])

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ borderRadius: '50%' }}
    >
      {rects}
    </svg>
  )
}

/* ---------- Cielo pixelado del banner ---------- */
export function PixelSky({ className = '', tall = false }) {
  // "tall" genera una versión vertical para columnas altas (tablet)
  const W = tall ? 48 : 96
  const H = tall ? 64 : 28
  const rects = useMemo(() => {
    const rnd = semilla('devnet-cielo')
    const bandas = ['#3d0f7a', '#4b1795', '#5a24a8', '#6a33b8', '#7b45c6', '#8b58d1']
    const grid = Array.from({ length: H }, (_, y) =>
      Array.from({ length: W }, () => bandas[Math.min(bandas.length - 1, Math.floor((y / H) * bandas.length))]),
    )
    // estrellas
    for (let i = 0; i < (tall ? 40 : 30); i++) grid[Math.floor(rnd() * (H - 16))][Math.floor(rnd() * W)] = '#d9c8ff'
    // luna
    const mx = W - 21
    for (let y = 2; y < 9; y++)
      for (let x = mx; x < mx + 7; x++) {
        const d = (x - mx - 3) ** 2 + (y - 5.5) ** 2
        if (d < 11) grid[y][x] = d < 3 ? '#b7a6d6' : '#cfc2e8'
      }
    // nubes
    const nube = (cx, cy, w) => {
      for (let y = 0; y < 5; y++) {
        const ancho = w - Math.abs(2 - y) * 4
        for (let x = -ancho; x <= ancho; x++) {
          const gx = cx + x + Math.floor(rnd() * 2)
          if (gx >= 0 && gx < W && cy + y < H) grid[cy + y][gx] = y > 2 ? '#c9b8ef' : '#f4efff'
        }
      }
    }
    if (tall) {
      nube(8, H - 30, 7)
      nube(38, H - 22, 8)
      nube(14, H - 14, 10)
      nube(42, H - 10, 9)
    } else {
      nube(14, 15, 9)
      nube(40, 18, 12)
      nube(66, 14, 8)
      nube(88, 19, 10)
    }
    for (let x = 0; x < W; x++) for (let y = H - 5; y < H; y++) grid[y][x] = rnd() > 0.15 ? '#f4efff' : '#c9b8ef'
    return aRects(grid)
  }, [W, H, tall])

  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" aria-hidden="true">
      {rects}
    </svg>
  )
}

/* ---------- Logo DevNet ---------- */
export function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="16" height="16" rx="3" fill="#5a24a8" />
      <path fill="#ece8f4" d="M3 3h4v1h1v1h1v6H8v1H7v1H3zM4 4v8h3v-1h1V5H7V4z" />
      <path fill="#f2c14e" d="M10 6h1v1h1v1h1V6h1v7h-1v-2h-1v-1h-1v3h-1z" />
    </svg>
  )
}
