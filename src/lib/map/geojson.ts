import { BoxBox, boxScale } from '../box/prefixed'
import { svgMapViewerConfig } from '../config'
import { V } from '../matrix'
import { Vdiv, Vmul, Vsub } from '../matrix/v'
import { MapData } from './data'
import { LineGeoJSON } from './geojson-types'

export type Point = V
export type Line = V[]
export type MultiLineString = V[][]
export type MultiPolygon = V[][][]

export function lineToPath(vs: Readonly<Line>): string {
  return l(vs.map(svgMapViewerConfig.mapConv))
}

export function multiLineStringToPath(vss: Readonly<MultiLineString>): string {
  return vss.map((vs) => l(vs.map(svgMapViewerConfig.mapConv))).join('')
}

export function multiPolygonToPath(vsss: Readonly<MultiPolygon>): string {
  return vsss
    .map((vss) =>
      vss.map((vs) => a(vs.map(svgMapViewerConfig.mapConv))).join('')
    )
    .join('')
}

export function a(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1, -1).map((a: V) => `L${s(a)}`) + 'Z'
}

export function l(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1).map((a: V) => `L${s(a)}`)
}

export function s([x, y]: V): string {
  return `${x},${y}`
}

function getViewBox(viewbox: Readonly<LineGeoJSON>): BoxBox {
  const vb0 = viewbox.features[0].geometry.coordinates
  const [x, y] = Vsub(vb0[1] as V, vb0[0] as V)

  const vb1 = viewbox.features[1].geometry.coordinates
  const [width, height] = Vsub(vb1[1] as V, vb1[0] as V)

  return { x, y, width, height }
}

export function calcScale(mapData: Readonly<MapData>) {
  const o: V = mapData.origin.features[0].geometry.coordinates as V

  const p = mapData.measures.features[0]
  const q = mapData.measures.features[1]

  const dist: V = [p.properties.length, q.properties.length]

  const pq: V = [p.geometry.coordinates[1][0], q.geometry.coordinates[1][1]]

  const len: V = Vsub(pq, o)

  const distScale: V = Vdiv(dist, len)

  // XXX svg <-> geo coordinate
  // XXX XXX use matrix

  const mapConv = (p: V) => Vmul(Vsub(p, o), distScale)
  const mapViewBox = boxScale(getViewBox(mapData.viewbox), distScale)

  return {
    mapConv,
    mapViewBox,
  }
}
