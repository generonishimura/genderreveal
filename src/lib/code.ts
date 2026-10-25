// 性別はどこにも保存せず、コードのハッシュ値で表す。
// URL のコードを見ただけでは男女が分からないようにするため。
export type Gender = 'boy' | 'girl'

const SALT = 'gender-reveal-v1'
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LEN = 8
const CODE_RE = new RegExp(`^[${CHARS}]{${CODE_LEN}}$`)

function hash(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function genderOf(code: string): Gender {
  return (hash(SALT + code) >>> 7) & 1 ? 'girl' : 'boy'
}

function randomCode(): string {
  const buf = new Uint32Array(CODE_LEN)
  crypto.getRandomValues(buf)
  return Array.from(buf, (n) => CHARS[n % CHARS.length]).join('')
}

export function makeCode(gender: Gender): string {
  let code: string
  do code = randomCode()
  while (genderOf(code) !== gender)
  return code
}

export function isValidCode(code: string): boolean {
  return CODE_RE.test(code)
}

export function buildRevealUrl(code: string, from: string): string {
  const url = new URL(import.meta.env.BASE_URL, location.href)
  url.searchParams.set('c', code)
  if (from) url.searchParams.set('f', from)
  return url.toString()
}
