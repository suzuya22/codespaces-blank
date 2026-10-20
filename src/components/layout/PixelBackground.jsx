import { useEffect, useRef } from 'react'
import './PixelBackground.css'

// Paleta coherente con los tokens del sitio (morados + acento dorado ocasional)
const COLORES_PIXEL = ['#7254d1', '#8668e6', '#4b1795', '#a884fc', '#5b3fb0', '#cbb8ff', '#7254d1', '#8668e6']
const COLOR_ACENTO = '#f2c14e'
const COLORES_GLIFO = ['#8668e6', '#a884fc', '#6d5ab8', '#cbb8ff']

const GLIFOS = [
  '0', '1', '{', '}', '</>', '()', '=>', '++', '&&', '#', 'fn', 'if', '::', '[]',
  '01', '10', '0x', '//', ';', '<>', 'void', 'int', 'var', '!=', '==', '{ }', '$_', '▮',
]

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const snap = (v, u) => Math.round(v / u) * u

// Fondo animado global: lluvia de píxeles, fragmentos de código y columnas binarias
export default function PixelBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let particulas = []
    let rafId = 0
    let last = performance.now()
    const mouse = { x: -9999, y: -9999 }

    // capa: 0 = lejos (pequeño, lento, tenue) · 1 = cerca (grande, rápido, brillante)
    const crearPixel = (inicial) => {
      const capa = Math.random()
      const acento = Math.random() < 0.04
      return {
        tipo: 'pixel',
        capa,
        x: rand(0, w),
        y: inicial ? rand(-h * 0.1, h) : rand(-60, -8),
        tam: capa < 0.55 ? pick([2, 2, 3]) : pick([3, 4, 4, 5, 6]),
        vel: 16 + capa * 58,
        alfa: 0.12 + capa * 0.45,
        color: acento ? COLOR_ACENTO : pick(COLORES_PIXEL),
        estela: Math.random() < 0.38 ? Math.floor(rand(2, 6)) : 0,
        fase: rand(0, Math.PI * 2),
        deriva: rand(-4, 4),
        empujeX: 0,
      }
    }

    const crearGlifo = (inicial) => {
      const capa = Math.random()
      return {
        tipo: 'glifo',
        capa,
        x: rand(0, w),
        y: inicial ? rand(-h * 0.1, h) : rand(-60, -10),
        tam: Math.round(10 + capa * 6),
        vel: 12 + capa * 28,
        alfa: 0.07 + capa * 0.2,
        color: pick(COLORES_GLIFO),
        texto: pick(GLIFOS),
        cambio: rand(0.6, 3),
        deriva: rand(-3, 3),
        empujeX: 0,
      }
    }

    // Columna estilo "flujo de datos" con cabeza brillante
    const crearFlujo = (inicial) => {
      const largo = Math.floor(rand(5, 11))
      return {
        tipo: 'flujo',
        capa: rand(0.3, 0.8),
        x: snap(rand(0, w), 16),
        y: inicial ? rand(-h * 0.2, h) : rand(-300, -100),
        tam: 12,
        vel: rand(35, 70),
        alfa: rand(0.14, 0.26),
        chars: Array.from({ length: largo }, () => (Math.random() < 0.5 ? '0' : '1')),
        cambio: rand(0.1, 0.35),
        deriva: 0,
        empujeX: 0,
      }
    }

    const generar = () => {
      const area = w * h
      const factor = w < 768 ? 0.6 : 1
      const nPix = Math.round(Math.min(170, area / 8500) * factor)
      const nGlifos = Math.round(Math.min(42, area / 38000) * factor)
      const nFlujos = Math.round(Math.min(7, area / 180000) * factor)
      particulas = [
        ...Array.from({ length: nPix }, () => crearPixel(true)),
        ...Array.from({ length: nGlifos }, () => crearGlifo(true)),
        ...Array.from({ length: nFlujos }, () => crearFlujo(true)),
      ]
      // Dibujar primero las capas lejanas para dar profundidad
      particulas.sort((a, b) => a.capa - b.capa)
    }

    const respawn = (p) => {
      const nueva = p.tipo === 'pixel' ? crearPixel(false) : p.tipo === 'glifo' ? crearGlifo(false) : crearFlujo(false)
      Object.assign(p, nueva)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false
      generar()
    }

    const dibujar = (t, dt) => {
      ctx.clearRect(0, 0, w, h)
      ctx.textBaseline = 'top'

      for (const p of particulas) {
        // Movimiento
        p.y += p.vel * dt
        p.x += (p.deriva + p.empujeX) * dt
        p.empujeX *= 0.92

        // Leve repulsión alrededor del cursor (solo capas cercanas)
        if (p.capa > 0.4) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < 110 && dist > 0.1) {
            p.empujeX += (dx / dist) * 260 * (1 - dist / 110) * dt * 10
          }
        }

        if (p.y > h + 140 || p.x < -40 || p.x > w + 40) {
          respawn(p)
          continue
        }

        if (p.tipo === 'pixel') {
          const sx = snap(p.x, 2)
          const sy = snap(p.y, 2)
          const parpadeo = 0.75 + 0.25 * Math.sin(t * 0.0025 + p.fase)
          const a = p.alfa * parpadeo
          ctx.fillStyle = p.color
          for (let i = p.estela; i >= 1; i--) {
            ctx.globalAlpha = a * (1 - i / (p.estela + 1)) * 0.55
            ctx.fillRect(sx, sy - i * (p.tam + 2), p.tam, p.tam)
          }
          ctx.globalAlpha = a
          ctx.fillRect(sx, sy, p.tam, p.tam)
        } else if (p.tipo === 'glifo') {
          p.cambio -= dt
          if (p.cambio <= 0) {
            p.texto = pick(GLIFOS)
            p.cambio = rand(0.6, 3)
          }
          ctx.font = `${p.tam}px "Pixelify Sans", "Courier New", monospace`
          ctx.globalAlpha = p.alfa
          ctx.fillStyle = p.color
          ctx.fillText(p.texto, snap(p.x, 2), snap(p.y, 2))
        } else {
          p.cambio -= dt
          if (p.cambio <= 0) {
            p.chars[Math.floor(Math.random() * p.chars.length)] = Math.random() < 0.5 ? '0' : '1'
            p.cambio = rand(0.1, 0.35)
          }
          ctx.font = `${p.tam}px "Pixelify Sans", "Courier New", monospace`
          const n = p.chars.length
          for (let i = 0; i < n; i++) {
            const esCabeza = i === n - 1
            ctx.globalAlpha = esCabeza ? Math.min(p.alfa * 2.6, 0.75) : p.alfa * ((i + 1) / n)
            ctx.fillStyle = esCabeza ? '#e9e1ff' : '#8668e6'
            ctx.fillText(p.chars[i], p.x, snap(p.y + i * (p.tam + 2), 2))
          }
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      // En móvil, con el juego tipo APK abierto, se pausa para no competir con WebGL
      const juegoMovil = w <= 768 && document.body.classList.contains('body--game-active')
      if (!juegoMovil) dibujar(now, dt)
      rafId = requestAnimationFrame(loop)
    }

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }
    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    window.addEventListener('resize', onResize)

    if (reduceMotion) {
      // Accesibilidad: un único fotograma estático
      dibujar(0, 0)
    } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
      rafId = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="pixel-bg" aria-hidden="true">
      <div className="pixel-bg__grid" />
      <canvas ref={canvasRef} className="pixel-bg__canvas" />
      <div className="pixel-bg__scanlines" />
      <div className="pixel-bg__vignette" />
    </div>
  )
}
