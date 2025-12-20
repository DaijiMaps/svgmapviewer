import { scale } from './scale'
import { sum } from './sum'
import { type Vec } from './types'

export function midpoint(ps: Readonly<Vec[]>): null | Vec {
  const q = sum(ps)

  return q === null ? null : scale(q, 1 / ps.length)
}
