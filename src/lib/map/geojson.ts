import areas from '../../data/areas.json'
import lines from '../../data/lines.json'
import measures from '../../data/measures.json'
import multipolygons from '../../data/multipolygons.json'
import multilinestrings from '../../data/multistrings.json'
import origin from '../../data/origin.json'
import points from '../../data/points.json'
import viewbox from '../../data/viewbox.json'
import { BoxBox } from '../box/prefixed'
import { V } from '../matrix'

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

export function r([x, y]: V): V {
  const svgX = (x - ox) * sx
  const svgY = (y - oy) * sy
  return [svgX, svgY]
}

export function s([x, y]: V): string {
  return `${x},${y}`
}

export const mapData = {
  origin,
  measures,
  areas,
  points,
  lines,
  multilinestrings,
  multipolygons,
  viewbox,
}

const [ox, oy]: V = mapData.origin.features[0].geometry.coordinates as V
const px = mapData.measures.features[0].geometry.coordinates[1][0]
const qy = mapData.measures.features[1].geometry.coordinates[1][1]

const op = px - ox
const oq = qy - oy

const distOP = mapData.measures.features[0].properties.length
const distOQ = mapData.measures.features[1].properties.length

const sx = distOP / op
const sy = distOQ / oq

const vb0 = viewbox.features[0].geometry.coordinates
const vbx = vb0[1][0] - vb0[0][0]
const vby = vb0[1][1] - vb0[0][1]
const vb1 = viewbox.features[1].geometry.coordinates
const vbw = vb1[1][0] - vb1[0][0]
const vbh = vb1[1][1] - vb1[0][1]

export const geoJsonViewBox: BoxBox = {
  x: vbx * sx,
  y: vby * sy,
  width: vbw * sx,
  height: vbh * sy,
}
