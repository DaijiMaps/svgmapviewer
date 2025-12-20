import { matrixToString, type MatrixMatrix as Matrix } from '../matrix/prefixed'

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

export function fixupCssString(s: string): string {
  // XXX transform
  return s
    .replaceAll(
      /translate\(([-]?[1-9][0-9]*\.[0-9][0-9])[0-9]*px,[ ]*([-]?[1-9][0-9]*\.[0-9][0-9])[0-9]*px\)/g,
      'translate($1px, $2px)'
    )
    .replaceAll(
      /matrix\(([^,][^,]*),([^,][^,]*),([^,][^,]*),([^,][^,]*),([1-9][0-9]*\.[0-9][0-9])[0-9]*,([1-9][0-9]*\.[0-9][0-9])[0-9]*\)/g,
      'matrix($1,$2,$3,$4,$5,$6)'
    )
}
