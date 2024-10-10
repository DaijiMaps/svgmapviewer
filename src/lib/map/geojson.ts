import areas from '../../data/areas.json'
import centroids from '../../data/centroids.json'
import lines from '../../data/lines.json'
import measures from '../../data/measures.json'
import multipolygons from '../../data/multipolygons.json'
import multilinestrings from '../../data/multistrings.json'
import origin from '../../data/origin.json'
import points from '../../data/points.json'
import viewbox from '../../data/viewbox.json'
import { BoxBox, boxScale } from '../box/prefixed'
import { V } from '../matrix'
import {
  LineGeoJSON,
  MultiLineGeoJSON,
  MultiPolygonGeoJSON,
  PointGeoJSON,
} from './geojson-types'

export type Point = V
export type Line = V[]
export type MultiLineString = V[][]
export type MultiPolygon = V[][][]

export function lineToPath(vs: Readonly<Line>): string {
  return l(vs.map(r))
}

export function multiLineStringToPath(vss: Readonly<MultiLineString>): string {
  return vss.map((vs) => l(vs.map(r))).join('')
}

export function multiPolygonToPath(vsss: Readonly<MultiPolygon>): string {
  return vsss.map((vss) => vss.map((vs) => a(vs.map(r))).join('')).join('')
}

export function a(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1, -1).map((a: V) => `L${s(a)}`) + 'Z'
}

export function l(vs: Readonly<V[]>): string {
  return `M${s(vs[0])}` + vs.slice(1).map((a: V) => `L${s(a)}`)
}

export function r(p: V): V {
  return Vmul(Vsub(p, o), distScale)
}

export function s([x, y]: V): string {
  return `${x},${y}`
}

export type MapData = {
  origin: PointGeoJSON
  measures: LineGeoJSON<{
    length: number
  }>
  areas: MultiPolygonGeoJSON
  points: PointGeoJSON
  lines: LineGeoJSON
  multilinestrings: MultiLineGeoJSON
  multipolygons: MultiPolygonGeoJSON
  centroids: PointGeoJSON
  viewbox: LineGeoJSON
}

export const mapData: MapData = {
  origin,
  measures,
  areas,
  points,
  lines,
  multilinestrings,
  multipolygons,
  centroids,
  viewbox,
}

const o: V = getOrigin()

function calcScale(): V {
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

  const s: V = Vdiv(dist, len)

  return s
}

function getOrigin(): V {
  return mapData.origin.features[0].geometry.coordinates as V
}

function getViewBox(): BoxBox {
  const vb0 = viewbox.features[0].geometry.coordinates
  const [x, y] = Vsub(vb0[1] as V, vb0[0] as V)

  const vb1 = viewbox.features[1].geometry.coordinates
  const [width, height] = Vsub(vb1[1] as V, vb1[0] as V)

  return { x, y, width, height }
}

function Vsub([ax, ay]: V, [bx, by]: V): V {
  return [ax - bx, ay - by]
}

function Vmul([ax, ay]: V, [bx, by]: V): V {
  return [ax * bx, ay * by]
}

function Vdiv([ax, ay]: V, [bx, by]: V): V {
  return [ax / bx, ay / by]
}

const distScale: V = calcScale()
const vb = getViewBox()

export const geoJsonViewBox: BoxBox = boxScale(vb, distScale)
