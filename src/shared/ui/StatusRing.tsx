import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * The Android app's signature ON ring, recreated pixel-faithfully on a canvas:
 * a breathing radial glow, 16 dots scattering outward along a wavy (sinusoidal)
 * trajectory that widens with distance, a thin base ring and a rotating
 * conic sweep-gradient arc — the exact maths from the StatusRing composable.
 *
 * Draws only the ring effects; overlay the teal core button + icon on top.
 * Honors prefers-reduced-motion (renders a single static frame).
 */
const RING_PRIMARY = [14, 148, 136] // #0e9488
const RING_SECONDARY = [10, 110, 102] // #0a6e66
const RING_BRIGHT = [44, 199, 184] // #2cc7b8
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`
const lerpRgb = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t)

export function StatusRing({ size }: { size: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const R = size / 2
    const k = size / 224 // scale factor vs the app's 224dp canvas
    let raf = 0

    const frame = (elapsed: number) => {
      const rotation = ((elapsed / 3200) % 1) * Math.PI * 2
      const pulse = (elapsed / 2400) % 1
      const breathe = 0.5 - 0.5 * Math.cos((elapsed / 2600) * Math.PI * 2)

      ctx.clearRect(0, 0, size, size)

      // breathing glow
      const glowAlpha = 0.1 + 0.14 * breathe
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      glow.addColorStop(0, rgba(RING_PRIMARY, glowAlpha))
      glow.addColorStop(1, rgba(RING_PRIMARY, 0))
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()

      // 16 dots scattering outward on a wavy path
      const count = 16
      for (let i = 0; i < count; i++) {
        const phase = (pulse + i / count) % 1
        const baseAngle = (360 / count) * i
        const wave = Math.sin(phase * Math.PI * 3 + i) * 16 * phase
        const ang = ((baseAngle + wave) * Math.PI) / 180
        const dist = R * 0.44 + R * 0.52 * phase
        const x = cx + Math.cos(ang) * dist
        const y = cy + Math.sin(ang) * dist
        const alpha = (1 - phase) * 0.9
        const dotR = (1.3 + 2.4 * (1 - phase)) * k * 1.35
        ctx.fillStyle = rgba(lerpRgb(RING_BRIGHT, RING_PRIMARY, phase), alpha)
        ctx.beginPath()
        ctx.arc(x, y, Math.max(0.6, dotR), 0, Math.PI * 2)
        ctx.fill()
      }

      // thin static base ring — hugs the button (small clean gap, no overlap)
      ctx.strokeStyle = rgba(RING_PRIMARY, 0.25)
      ctx.lineWidth = 3 * k
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.65, 0, Math.PI * 2)
      ctx.stroke()

      // rotating sweep-gradient arc (the main modern effect)
      const anyCtx = ctx as unknown as { createConicGradient?: (a: number, x: number, y: number) => CanvasGradient }
      if (anyCtx.createConicGradient) {
        const conic = anyCtx.createConicGradient(rotation, cx, cy)
        conic.addColorStop(0, rgba(RING_PRIMARY, 0))
        conic.addColorStop(0.25, rgba(RING_SECONDARY, 0))
        conic.addColorStop(0.5, rgba(RING_BRIGHT, 0.95))
        conic.addColorStop(0.75, rgba(RING_PRIMARY, 0.95))
        conic.addColorStop(1, rgba(RING_PRIMARY, 0))
        ctx.strokeStyle = conic
        ctx.lineWidth = 5 * k
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(cx, cy, R * 0.65, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    if (reduceMotion) {
      frame(0)
      return
    }
    const start = performance.now()
    const loop = (t: number) => {
      frame(t - start)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [size, reduceMotion])

  return <canvas ref={ref} style={{ width: size, height: size }} className="absolute inset-0" aria-hidden />
}
