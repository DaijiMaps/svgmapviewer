import { svgMapViewerConfig } from '../config'
import { V } from '../matrix'
import { Vunwrap } from './geojson'

export type Point = V
export type Line = V[]
export type MultiLineString = V[][]
export type MultiPolygon = V[][][]

export function lineToPath(vs: Readonly<Line>): string {
  return l(vs.map(Vunwrap(svgMapViewerConfig.mapCoord.fromGeo)))
}

export function multiLineStringToPath(vss: Readonly<MultiLineString>): string {
  return vss
    .map((vs) => l(vs.map(Vunwrap(svgMapViewerConfig.mapCoord.fromGeo))))
    .join('')
}

export function multiPolygonToPath(vsss: Readonly<MultiPolygon>): string {
  return vsss
    .map((vss) =>
      vss
        .map((vs) => a(vs.map(Vunwrap(svgMapViewerConfig.mapCoord.fromGeo))))
        .join('')
    )
    .join('')
}

function a(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1, -1).map((a: V) => `L${s(a)}`) + 'Z'
}

function l(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1).map((a: V) => `L${s(a)}`)
}

function s([x, y]: V): string {
  return `${x},${y}`
}
