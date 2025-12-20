import { map2 } from './map'
import { type Vec } from './types'

export function max<T extends Vec>(a: T, b: T): T {
  return map2(a, b, Math.max)
}

export const maxF =
  <T extends Vec>(b: T): ((_a: T) => Vec) =>
  (a: T) =>
    max(a, b)
