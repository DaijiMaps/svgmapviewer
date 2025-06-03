import { type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../config'
import {
  type LinesFilter,
  type MultiPolygonsFilter,
  type Point,
  type PointsFilter,
} from '../geo'
import { type V, vUnvec, vVec } from '../tuple'
import type { MapObjects } from './types'

export function RenderMapObjects(
  props: Readonly<{
    mapObjects: MapObjects[]
  }>
): ReactNode {
  return (
    <g className="map-objects">
      {props.mapObjects.map((entry, i) => (
        <g key={i}>
          <RenderObjects
            name={entry.name}
            path={entry.path}
            width={entry.width}
            vs={entryToVs(entry)}
          />
        </g>
      ))}
    </g>
  )
}

export function entryToVs({
  pointsFilter,
  polygonsFilter,
  linesFilter,
  data,
}: Readonly<MapObjects>): Point[] {
  return [
    ...(pointsFilter !== undefined ? getPoints(pointsFilter) : []),
    ...(polygonsFilter !== undefined ? getPolygons(polygonsFilter) : []),
    ...(linesFilter !== undefined ? getLines(linesFilter) : []),
    ...(data !== undefined ? data : []),
  ]
}

function getPoints(filter: PointsFilter): Point[] {
  return cfg.mapData.points.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

function getPolygons(filter: MultiPolygonsFilter) {
  return cfg.mapData.multipolygons.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

function getLines(filter: LinesFilter) {
  return cfg.mapData.lines.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

function conv(p: V): V {
  return vUnvec(cfg.mapCoord.matrix.transformPoint(vVec(p)))
}

export function RenderObjects(
  props: Readonly<{ name: string; width: number; path: string; vs: V[] }>
): ReactNode {
  return (
    <path
      className={props.name}
      fill="none"
      stroke="black"
      strokeWidth={props.width}
      d={props.vs
        .map(
          ([x, y]) =>
            `M ${x},${y}`.replaceAll(/([.]\d\d)\d*/g, '$1') + props.path
        )
        .join('')}
    />
  )
}
