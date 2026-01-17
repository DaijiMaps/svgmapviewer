export type MatrixObject = Readonly<{
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
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
