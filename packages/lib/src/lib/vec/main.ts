//import { type ReadonlyDeep } from 'type-fest'
//import { type V } from '../tuple'
import type { Vec } from './types'

type V = [number, number]

function vec(x: number, y: number): Vec {
  return { x, y }
}

const zero: Vec = vec(0, 0)
const one: Vec = vec(1, 1)

function fromV([x, y]: Readonly<V>): Vec {
  return { x, y }
}

function toV({ x, y }: Vec): V {
  return [x, y]
}

export { fromV, one, toV, vec, zero }
