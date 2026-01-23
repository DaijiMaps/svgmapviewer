export type MatrixObject = Readonly<{
  readonly a: number
  readonly b: number
  readonly c: number
  readonly d: number
  readonly e: number
  readonly f: number
}>

export function matrixObject(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
): MatrixObject {
  return { a, b, c, d, e, f }
}
