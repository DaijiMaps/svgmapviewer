import { H, M, V } from '../tuple'

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

export const ab = ([ab]: M): V => ab
export const cd = ([, cd]: M): V => cd
export const ef = ([, , ef]: M): V => ef

export const ace = ([[a], [c], [e]]: M): H => [a, c, e]
export const bdf = ([[, b], [, d], [, f]]: M): H => [b, d, f]

export const prod = ([p, q, r]: H, [s, t]: V, n: number): number =>
  p * s + q * t + r * n

export type { Matrix }

export { copy, empty, matrix }
