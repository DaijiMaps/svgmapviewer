import { type M, type V } from '../tuple'
import { ace, bdf, prod } from './main'

export type Apply = (m: M, v: V, n: number) => V

export function apply(m: M, v: V, n: number): V {
  return [prod(ace(m), v, n), prod(bdf(m), v, n)]
}

export type ApplyF = (n: number) => (v: V) => (m: M) => V

export function applyF(n: number): ReturnType<ApplyF> {
  return function (v: V) {
    return function (m: M) {
      return apply(m, v, n)
    }
  }
}
