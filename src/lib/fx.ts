export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export function vibrate(pattern: number | number[]) {
  navigator.vibrate?.(pattern)
}

// Web Audio で心音とチャイムを鳴らす。音声ファイルは使わない。
let ctx: AudioContext | null = null
export let muted = false
export function setMuted(v: boolean) {
  muted = v
}

function audio(): AudioContext | null {
  if (muted) return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, dur: number, gain: number, type: OscillatorType = 'sine') {
  const a = audio()
  if (!a) return
  const t = a.currentTime + start
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

export function heartbeat() {
  tone(62, 0, 0.18, 0.7)
  tone(55, 0.22, 0.22, 0.5)
}

export function pop() {
  tone(660, 0, 0.12, 0.15, 'triangle')
}

export function chime() {
  ;[523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.12, 1.4, 0.18, 'triangle'))
}
