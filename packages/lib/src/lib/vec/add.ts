import { type Vec } from './index'
import { MF2ToMC2, type C1 } from './utils'

export function add<T extends Vec>(a: T, b: T): T {
  const x = a.x + b.x
  const y = a.y + b.y
  return { ...a, x, y }
}

export type AddF<T extends Vec> = (b: T) => (a: T) => T

export const addF =
  <T extends Vec>(b: T) =>
  (a: T): Vec =>
    add(a, b)

export function addF_<T extends Vec>(a: T): C1<T, T> {
  return MF2ToMC2<T>(add)(a)
}
