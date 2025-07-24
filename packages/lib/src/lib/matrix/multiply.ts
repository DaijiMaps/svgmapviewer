import { type M } from '../tuple'
import { apply } from './apply'
import { ab, cd, ef } from './main'

export function multiply(p: M, q: M): M {
  return [apply(p, ab(q), 0), apply(p, cd(q), 0), apply(p, ef(q), 1)]
}

export type MultiplyF = (q: M) => (p: M) => M

export function multiplyF(q: M): ReturnType<MultiplyF> {
  return function (p: M) {
    return multiply(p, q)
  }
}
