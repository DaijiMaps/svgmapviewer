import { MatrixMatrix as Matrix, matrixToString } from './matrix/prefixed'

export type CSSMatrix = Readonly<Matrix | Matrix[]>

export function isCssMatrixMatrix(m: CSSMatrix): m is Matrix {
  return (
    m instanceof Array &&
    m.length === 3 &&
    m[0] instanceof Array &&
    m[0].length === 2 &&
    typeof m[0][0] === 'number'
  )
}

export function isCssMatrixArray(m: CSSMatrix): m is Matrix[] {
  return !isCssMatrixMatrix(m)
}

export function cssMatrixToString(m: CSSMatrix): string {
  return isCssMatrixMatrix(m)
    ? matrixToString(m)
    : (m as Matrix[]).map(matrixToString).join(' ')
}
