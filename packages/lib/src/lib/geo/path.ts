import { svgMapViewerConfig as cfg } from '../config'
import { type V, vUnvec, vVec } from '../tuple'

export type Point = V
export type Line = V[]
export type MultiLineString = V[][]
export type MultiPolygon = V[][][]

export function lineToPath(vs: Readonly<Line>): string {
  return (
    l(vs.map(vFromGeo))
      // XXX truncate coord (1234.5678 to 1234.56)
      .replaceAll(/([.]\d\d)\d*/g, '$1')
  )
}

export function multiLineStringToPath(vss: Readonly<MultiLineString>): string {
  return (
    vss
      .map((vs) => l(vs.map(vFromGeo)))
      .join('')
      // XXX truncate coord (1234.5678 to 1234.56)
      .replaceAll(/([.]\d\d)\d*/g, '$1')
  )
}

export function multiPolygonToPath(vsss: Readonly<MultiPolygon>): string {
  return (
    vsss
      .map((vss) => vss.map((vs) => a(vs.map(vFromGeo))).join(''))
      .join('')
      // XXX truncate coord (1234.5678 to 1234.56)
      .replaceAll(/([.]\d\d)\d*/g, '$1')
  )
}

const vFromGeo = (p: V): V => vUnvec(cfg.mapCoord.fromGeo(vVec(p)))

function a(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1, -1).map((a: V) => `L${s(a)}`) + 'Z'
}

function l(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1).map((a: V) => `L${s(a)}`)
}

function s([x, y]: V): string {
  return `${x},${y}`
}
