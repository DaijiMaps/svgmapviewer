import type { VecVec } from '../vec/prefixed'

const RADIUS = 6371 // km
const PI = Math.PI
const cos = Math.cos
const sin = Math.sin
const atan2 = Math.atan2
const sqrt = Math.sqrt

function r(n: number): number {
  return (n * PI) / 180
}

export function haversineDistance(a: VecVec, b: VecVec): number {
  const dy = r(b.y - a.y)
  const dx = r(b.x - a.x)

  const h =
    cos(r(a.y)) * cos(r(b.y)) * sin(dx / 2) * sin(dx / 2) +
    sin(dy / 2) * sin(dy / 2)

  const angularDistance = 2 * atan2(sqrt(h), sqrt(1 - h))

  return RADIUS * angularDistance * 1000
}
