import { type Dir, type HV, type Size } from './types'
import { type Vec } from './vec'
import { vecVec } from './vec/prefixed'

export function diag(size: Readonly<Size>, v: Vec): Dir {
  const a = size.width / size.height
  const p = v.x / v.y > a
  const q = Math.abs((size.width - v.x) / v.y) > a
  return p && q ? 0 : p && !q ? 1 : !p && !q ? 2 : 3
}

export function diag2(size: Readonly<Size>, v: Vec): HV {
  const a = size.width / size.height
  const r = vecVec(v.x / size.width, v.y / size.height)
  if (a > 1) {
    // horizontal
    const h = r.x > 0.5 ? 1 : r.x < 0.5 ? -1 : 0
    const v = r.y < 0.25 ? 1 : r.y > 0.75 ? -1 : 0
    return { h, v }
  } else {
    // vertical
    const v = r.y > 0.5 ? 1 : r.y < 0.5 ? -1 : 0
    const h = r.x < 0.25 ? 1 : r.x > 0.75 ? -1 : 0
    return { h, v }
  }
}
