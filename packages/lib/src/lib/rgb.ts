/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-throw-statements */
type Rgb = { r: number; g: number; b: number }

const d = Math.round
const tmp = document.createElement('div')

export function rgbToString({ r, g, b }: Readonly<Rgb>): string {
  return `rgb(${d(r)}, ${d(g)}, ${d(b)})`
}

export const toRgbString = (c: string): string => {
  tmp.style.color = c
  document.body.appendChild(tmp)
  const s = getComputedStyle(tmp).color
  document.body.removeChild(tmp)
  return s
}

export function parseRgbString(rgb: string): Rgb {
  const m = rgb.match(/\d+/g)
  if (!m || m.length !== 3) throw new Error('invalid color!')
  const r = Number(m[0])
  const g = Number(m[1])
  const b = Number(m[2])
  return { r, g, b }
}

export function rgbShadow(rgb: Readonly<Rgb>): Rgb {
  return {
    r: rgb.r / 2,
    g: rgb.g / 2,
    b: rgb.b / 2,
  }
}
