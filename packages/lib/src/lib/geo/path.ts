import { svgMapViewerConfig as cfg } from '../../config'
import { type V, vUnvec, vVec } from '../tuple'
import type { VecVec } from '../vec/prefixed'
import type { Line, MultiLineString, MultiPolygon } from './path-types'

export function lineToPathD(vs: Readonly<Line>): string {
  return (
    l(vs.map(vFromGeo))
      // XXX truncate coord (1234.5678 to 1234.56)
      .replaceAll(/([.]\d\d)\d*/g, '$1')
  )
}

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

export function multiLineStringToPathD(vss: Readonly<MultiLineString>): string {
  return (
    vss
      .map((vs) => l(vs.map(vFromGeo)))
      .join('')
      // XXX truncate coord (1234.5678 to 1234.56)
      .replaceAll(/([.]\d\d)\d*/g, '$1')
  )
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

export function multiPolygonToPathD(vsss: Readonly<MultiPolygon>): string {
  return (
    vsss
      .map((vss) => vss.map((vs) => a(vs.map(vFromGeo))).join(''))
      .join('')
      // XXX truncate coord (1234.5678 to 1234.56)
      .replaceAll(/([.]\d\d)\d*/g, '$1')
  )
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

// XXX
// XXX
// XXX
const vFromGeo = (p: V): V =>
  vUnvec(cfg.mapCoord.matrix.transformPoint(vVec(p)))
// XXX
// XXX
// XXX

function a(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1, -1).map((a: V) => `L${s(a)}`) + 'Z'
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

function l(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1).map((a: V) => `L${s(a)}`)
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

function s([x, y]: V): string {
  return `${x},${y}`
}

function s2({ x, y }: VecVec): string {
  return `${x},${y}`
}
