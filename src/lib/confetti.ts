import type { Gender } from './code'

const PALETTE: Record<Gender, string[]> = {
  boy: ['#ffffff', '#cfe3f3', '#7fadd3', '#f6d58e', '#a9cbe6'],
  girl: ['#ffffff', '#f9d9df', '#e39aa8', '#f6d58e', '#f3b9c4'],
}

type Piece = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; c: string; shape: 0 | 1 | 2 }

export function confetti(canvas: HTMLCanvasElement, gender: Gender, durationMs = 7000) {
  const g = canvas.getContext('2d')
  if (!g) return
  const ctx = g
  const dpr = window.devicePixelRatio || 1
  const w = innerWidth
  const h = innerHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const colors = PALETTE[gender]
  const pieces: Piece[] = []
  const burst = (n: number) => {
    for (let i = 0; i < n; i++) {
      pieces.push({
        x: w / 2 + (Math.random() - 0.5) * 60,
        y: h * 0.45,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 17 - 5,
        r: Math.random() * 7 + 5,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0],
        shape: ((Math.random() * 3) | 0) as 0 | 1 | 2,
      })
    }
  }
  burst(160)
  setTimeout(() => burst(90), 700)

  const drawHeart = (s: number) => {
    ctx.beginPath()
    ctx.moveTo(0, s * 0.3)
    ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.35)
    ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.3)
    ctx.fill()
  }
  const start = performance.now()
  const frame = (t: number) => {
    ctx.clearRect(0, 0, w, h)
    for (const p of pieces) {
      p.vy = Math.min(p.vy + 0.28, 4.5)
      p.vx *= 0.985
      p.x += p.vx + Math.sin((t + p.r * 100) / 400) * 0.6
      p.y += p.vy
      p.rot += p.vr
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.c
      if (p.shape === 0) ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2)
      else if (p.shape === 1) {
        ctx.beginPath()
        ctx.arc(0, 0, p.r / 2.6, 0, Math.PI * 2)
        ctx.fill()
      } else drawHeart(p.r * 0.8)
      ctx.restore()
    }
    if (t - start < durationMs) requestAnimationFrame(frame)
    else ctx.clearRect(0, 0, w, h)
  }
  requestAnimationFrame(frame)
}
