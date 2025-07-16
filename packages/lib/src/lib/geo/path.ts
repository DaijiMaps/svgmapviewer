import { svgMapViewerConfig as cfg } from '../../config'
import { type V, vUnvec, vVec } from '../tuple'
import type { Line, MultiLineString, MultiPolygon } from './path-types'

export function lineToPathD(vs: Readonly<Line>): string {
  return (
    l(vs.map(vFromGeo))
      // XXX truncate coord (1234.5678 to 1234.56)
      .replaceAll(/([.]\d\d)\d*/g, '$1')
  )
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

export function multiPolygonToPathD(vsss: Readonly<MultiPolygon>): string {
  return (
    vsss
      .map((vss) => vss.map((vs) => a(vs.map(vFromGeo))).join(''))
      .join('')
      // XXX truncate coord (1234.5678 to 1234.56)
      .replaceAll(/([.]\d\d)\d*/g, '$1')
  )
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

function l(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1).map((a: V) => `L${s(a)}`)
}

function s([x, y]: V): string {
  return `${x},${y}`
}
