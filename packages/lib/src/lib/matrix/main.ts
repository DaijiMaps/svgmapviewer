import { type H, type M, type V } from '../tuple'

type Matrix = M

const empty: Matrix = [
  [1, 0],
  [0, 1],
  [0, 0],
]

function matrix(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
): Matrix {
  return [
    [a, b],
    [c, d],
    [e, f],
  ]
}

function copy([[a, b], [c, d], [e, f]]: Readonly<
  [
    Readonly<[a: number, b: number]>,
    Readonly<[c: number, d: number]>,
    Readonly<[e: number, f: number]>,
  ]
>): Matrix {
  return [
    [a, b],
    [c, d],
    [e, f],
  ]
}

////

export function ab([ab]: M): V {
  return ab
}
export function cd([, cd]: M): V {
  return cd
}
export function ef([, , ef]: M): V {
  return ef
}

export function ace([[a], [c], [e]]: M): H {
  return [a, c, e]
}
export function bdf([[, b], [, d], [, f]]: M): H {
  return [b, d, f]
}

export function prod([p, q, r]: H, [s, t]: V, n: number): number {
  return p * s + q * t + r * n
}

export function toDOMMatrix([
  [a, b],
  [c, d],
  [e, f],
]: Matrix): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly([a, b, c, d, e, f])
}

export { type Matrix }

export { copy, empty, matrix }
