import { M } from '../tuple'

export function toString([[a, b], [c, d], [e, f]]: M): string {
  return `matrix(${a},${b},${c},${d},${e},${f})`
}
