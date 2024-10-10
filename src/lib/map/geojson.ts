import { BoxBox, boxScale } from '../box/prefixed'
import { svgMapViewerConfig } from '../config'
import { V } from '../matrix'
import { MapData } from './data'
import { LineGeoJSON } from './geojson-types'

export type Point = V
export type Line = V[]
export type MultiLineString = V[][]
export type MultiPolygon = V[][][]

export function lineToPath(vs: Readonly<Line>): string {
  return l(vs.map(svgMapViewerConfig.mapCoordToSvg))
}

export function multiLineStringToPath(vss: Readonly<MultiLineString>): string {
  return vss.map((vs) => l(vs.map(svgMapViewerConfig.mapCoordToSvg))).join('')
}

export function multiPolygonToPath(vsss: Readonly<MultiPolygon>): string {
  return vsss
    .map((vss) =>
      vss.map((vs) => a(vs.map(svgMapViewerConfig.mapCoordToSvg))).join('')
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

export function calcScale(mapData: Readonly<MapData>) {
  const [ox, oy]: V = mapData.origin.features[0].geometry.coordinates as V

  const p = mapData.measures.features[0]
  const q = mapData.measures.features[1]

  //const distP = p.properties.length
  //const distQ = q.properties.length

  const dist: V = [p.properties.length, q.properties.length]

  const px = p.geometry.coordinates[1][0]
  const qy = q.geometry.coordinates[1][1]

  //const op = px - ox
  //const oq = qy - oy

  const len: V = [px - ox, qy - oy]

  //const sx = distP / op
  //const sy = distQ / oq

  const distScale: V = Vdiv(dist, len)

  const toSvg = (p: V) => Vmul(Vsub(p, [ox, oy]), distScale)
  const geoJsonViewBox = boxScale(getViewBox(mapData.viewbox), distScale)

  return {
    toSvg,
    geoJsonViewBox,
  }
}

export function getViewBox(viewbox: Readonly<LineGeoJSON>): BoxBox {
  const vb0 = viewbox.features[0].geometry.coordinates
  const [x, y] = Vsub(vb0[1] as V, vb0[0] as V)

  const vb1 = viewbox.features[1].geometry.coordinates
  const [width, height] = Vsub(vb1[1] as V, vb1[0] as V)

  return { x, y, width, height }
}

export function Vsub([ax, ay]: V, [bx, by]: V): V {
  return [ax - bx, ay - by]
}

export function Vmul([ax, ay]: V, [bx, by]: V): V {
  return [ax * bx, ay * by]
}

export function Vdiv([ax, ay]: V, [bx, by]: V): V {
  return [ax / bx, ay / by]
}
