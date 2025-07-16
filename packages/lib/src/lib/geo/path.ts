import { type V } from '../tuple'
import type { VecVec } from '../vec/prefixed'
import type { Line, MultiLineString, MultiPolygon } from './path-types'

export function lineToPathD(
  m: DOMMatrixReadOnly
): (vs: Readonly<Line>) => string {
  return function (vs: Readonly<Line>): string {
    return (
      l(vs, m)
        // XXX truncate coord (1234.5678 to 1234.56)
        .replaceAll(/([.]\d\d)\d*/g, '$1')
    )
  }
}

export function multiLineStringToPathD(
  m: DOMMatrixReadOnly
): (vss: Readonly<MultiLineString>) => string {
  return function (vss: Readonly<MultiLineString>): string {
    return (
      vss
        .map((vs) => l(vs, m))
        .join('')
        // XXX truncate coord (1234.5678 to 1234.56)
        .replaceAll(/([.]\d\d)\d*/g, '$1')
    )
  }
}

export function multiPolygonToPathD(
  m: DOMMatrixReadOnly
): (vsss: Readonly<MultiPolygon>) => string {
  return function (vsss: Readonly<MultiPolygon>): string {
    return (
      vsss
        .map((vss) => vss.map((vs) => a(vs, m)).join(''))
        .join('')
        // XXX truncate coord (1234.5678 to 1234.56)
        .replaceAll(/([.]\d\d)\d*/g, '$1')
    )
  }
}

function a(vs: Readonly<V[]>, m: DOMMatrixReadOnly): string {
  const [x, y] = vs[0]

  return (
    `M${s(m.transformPoint({ x, y }))}` +
    vs
      .slice(1, -1)
      .map(([x, y]) => m.transformPoint({ x, y }))
      .map((a: VecVec) => `L${s(a)}`) +
    'Z'
  )
}

function l(vs: Readonly<V[]>, m: DOMMatrixReadOnly): string {
  const [x, y] = vs[0]

  return (
    `M${s(m.transformPoint({ x, y }))}` +
    vs
      .slice(1)
      .map(([x, y]) => m.transformPoint({ x, y }))
      .map((a: VecVec) => `L${s(a)}`)
  )
}

function s({ x, y }: VecVec): string {
  return `${x},${y}`
}
