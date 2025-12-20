import { map2 } from './map'
import { type Vec } from './types'

export function min<T extends Vec>(a: T, b: T): T {
  return map2(a, b, Math.min)
}

export const minF =
  <T extends Vec>(b: T): ((_a: T) => Vec) =>
  (a: T) =>
    min(a, b)
