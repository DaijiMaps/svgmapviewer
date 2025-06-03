import { type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { svgMapViewerConfig as cfg } from '../config'
import {
  type LinesFilter,
  type Point,
  type PointsFilter,
  type PolygonsFilter,
} from '../geo'
import { type V, vUnvec, vVec } from '../tuple'
import type { MapSymbols, RenderMapSymbolsProps } from './types'

export function RenderMapSymbols(
  props: Readonly<RenderMapSymbolsProps>
): ReactNode {
  return (
    <g className="map-symbols">
      {props.mapSymbols.map((entry, i) => {
        return (
          <Fragment key={i}>
            <g className={entry.name}>
              <RenderUses
                name={entry.name}
                href={entry.href}
                vs={entryToVs(entry)}
              />
            </g>
          </Fragment>
        )
      })}
    </g>
  )
}

export function entryToVs({
  pointsFilter,
  polygonsFilter,
  linesFilter,
  data,
}: Readonly<MapSymbols>): Point[] {
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

function getPolygons(filter: PolygonsFilter) {
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

export function RenderUses(
  props: Readonly<{ name: string; href: string; vs: V[] }>
): ReactNode {
  return (
    <>
      {props.vs.map(([x, y], j) => (
        <use
          key={j}
          className={`${props.name}-${j}`}
          href={props.href}
          style={{
            transform:
              `translate(${x}px, ${y}px)`.replaceAll(/([.]\d\d)\d*/g, '$1') +
              `scale(var(--map-symbol-size))`,
          }}
        />
      ))}
    </>
  )
}
