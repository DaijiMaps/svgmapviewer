import { type Dir, type HV, type Size } from './types'
import { type Vec } from './vec'
import { vecVec } from './vec/prefixed'

export function diag(size: Readonly<Size>, v: Vec): Dir {
  const a = size.width / size.height
  const p = v.x / v.y > a
  const q = Math.abs((size.width - v.x) / v.y) > a
  return p && q ? 0 : p && !q ? 1 : !p && !q ? 2 : 3
}

export function diag2(size: Readonly<Size>, { x, y }: Vec): HV {
  const a = size.width / size.height
  const r = vecVec(x / size.width, y / size.height)
  const h = a > 1 ? div2(r.x) : div3(r.x)
  const v = a > 1 ? div3(r.y) : div2(r.y)
  const th = Math.atan2(size.height, size.width)
  return { h, v, th }
}

function div2(n: number): -1 | 0 | 1 {
  return n > 0.5 ? -1 : n < 0.5 ? 1 : 0
}

function div3(n: number): -1 | 0 | 1 {
  return n < 0.3 ? 1 : n > 0.7 ? -1 : 0
}
