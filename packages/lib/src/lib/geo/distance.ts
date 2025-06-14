import { vecMap, vecSub, type VecVec } from '../vec/prefixed'

const R = 6371 // km
const PI = Math.PI
const cos = Math.cos
const sin = Math.sin
const atan2 = Math.atan2
const sqrt = Math.sqrt
function pow2(n: number): number {
  return Math.pow(n, 2)
}

function rad(n: number): number {
  return (n * PI) / 180
}

export function haversineDistance(oa: VecVec, ob: VecVec): number {
  const a = vecMap(oa, rad)
  const b = vecMap(ob, rad)
  const d = vecSub(b, a)

  const h = cos(a.y) * cos(b.y) * pow2(sin(d.x / 2)) + pow2(sin(d.y / 2))

  const angularDistance = 2 * atan2(sqrt(h), sqrt(1 - h))

  return R * angularDistance * 1000
}
