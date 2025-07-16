import { type V } from '../tuple'
import type { VecVec } from '../vec/prefixed'
import type { Line, MultiLineString, MultiPolygon } from './path-types'

export function lineToPathD2(
  m: DOMMatrixReadOnly
): (vs: Readonly<Line>) => string {
  return function (vs: Readonly<Line>): string {
    return (
      l2(vs, m)
        // XXX truncate coord (1234.5678 to 1234.56)
        .replaceAll(/([.]\d\d)\d*/g, '$1')
    )
  }
}

export function multiLineStringToPathD2(
  m: DOMMatrixReadOnly
): (vss: Readonly<MultiLineString>) => string {
  return function (vss: Readonly<MultiLineString>): string {
    return (
      vss
        .map((vs) => l2(vs, m))
        .join('')
        // XXX truncate coord (1234.5678 to 1234.56)
        .replaceAll(/([.]\d\d)\d*/g, '$1')
    )
  }
}

export function multiPolygonToPathD2(
  m: DOMMatrixReadOnly
): (vsss: Readonly<MultiPolygon>) => string {
  return function (vsss: Readonly<MultiPolygon>): string {
    return (
      vsss
        .map((vss) => vss.map((vs) => a2(vs, m)).join(''))
        .join('')
        // XXX truncate coord (1234.5678 to 1234.56)
        .replaceAll(/([.]\d\d)\d*/g, '$1')
    )
  }
}

function a2(vs: Readonly<V[]>, m: DOMMatrixReadOnly): string {
  const [x, y] = vs[0]

  return (
    `M${s2(m.transformPoint({ x, y }))}` +
    vs
      .slice(1, -1)
      .map(([x, y]) => m.transformPoint({ x, y }))
      .map((a: VecVec) => `L${s2(a)}`) +
    'Z'
  )
}

function l2(vs: Readonly<V[]>, m: DOMMatrixReadOnly): string {
  const [x, y] = vs[0]

  return (
    `M${s2(m.transformPoint({ x, y }))}` +
    vs
      .slice(1)
      .map(([x, y]) => m.transformPoint({ x, y }))
      .map((a: VecVec) => `L${s2(a)}`)
  )
}

function s2({ x, y }: VecVec): string {
  return `${x},${y}`
}
