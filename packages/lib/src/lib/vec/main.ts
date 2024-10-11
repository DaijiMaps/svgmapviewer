import { ReadonlyDeep } from 'type-fest'
import { V } from '../matrix'
import { ImmutableShallow } from '../utils'

type Vec = Readonly<
  ImmutableShallow<{
    x: number
    y: number
  }>
>

type Vecs = ReadonlyDeep<Vec[]>

function vec(x: number, y: number): Vec {
  return { x, y }
}

const zero = vec(0, 0)
const one = vec(1, 1)

function fromV([x, y]: V): Vec {
  return { x, y }
}

function toV({ x, y }: Vec): V {
  return [x, y]
}

export type { Vec, Vecs }

export { fromV, one, toV, vec, zero }
