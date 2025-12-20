import { type V } from '../tuple'
import { type Vec } from './types'

export function scale<T extends Vec>(a: T, s: number | V | Vec): T {
  const sx = typeof s === 'number' ? s : s instanceof Array ? s[0] : s.x
  const sy = typeof s === 'number' ? s : s instanceof Array ? s[1] : s.y
  const x = a.x * sx
  const y = a.y * sy
  return { ...a, x, y }
}

export const scaleF =
  <T extends Vec>(s: number | V | Vec): ((_v: T) => T) =>
  (v: T) =>
    scale(v, s)
