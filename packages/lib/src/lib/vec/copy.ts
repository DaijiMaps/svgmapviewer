import { type Vec } from './types'

export function copy<T extends Vec>(v: T): T {
  return { ...v }
}
