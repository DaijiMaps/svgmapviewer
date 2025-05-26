import { type Dir, type Size } from './types'
import { type Vec } from './vec'

export function diag(size: Readonly<Size>, v: Vec): Dir {
  const a = size.width / size.height
  const p = v.x / v.y > a
  const q = Math.abs((size.width - v.x) / v.y) > a
  return p && q ? 0 : p && !q ? 1 : !p && !q ? 2 : 3
}
