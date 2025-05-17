import { useSelector } from '@xstate/react'
import { Fragment } from 'react/jsx-runtime'
import {
  selectLayoutConfig,
  selectLayoutSvgScaleS,
  selectZoom,
} from '../../Map'
import { svgMapViewerConfig as cfg } from '../config'
import { CentroidsFilter, MidpointsFilter, Point, PointsFilter } from '../geo'
import { V, vUnvec, vVec } from '../tuple'
import { RenderMapProps } from '../types'

export interface RenderMapSymbolsProps extends RenderMapProps {
  mapSymbols: MapSymbols[]
}

export function RenderMapSymbols(props: Readonly<RenderMapSymbolsProps>) {
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

export function RenderMapSymbolStyles(props: Readonly<RenderMapSymbolsProps>) {
  const { renderMapRef } = props

  const config = useSelector(renderMapRef, selectLayoutConfig)
  const s = useSelector(renderMapRef, selectLayoutSvgScaleS)
  const zoom = useSelector(renderMapRef, selectZoom)
  const sz =
    config.fontSize *
    // display symbol slightly larger as zoom goes higher
    (0.5 + 0.5 * Math.log2(Math.max(1, zoom))) *
    s

  return (
    <style>
      {`
.map-symbols {
--map-symbol-size: ${sz / 72};
}
`}
      {props.mapSymbols.map((entry, i) => {
        return (
          <Fragment key={i}>
            <RenderUseStyles
              name={entry.name}
              href={entry.href}
              vs={entryToVs(entry)}
            />
          </Fragment>
        )
      })}
    </style>
  )
}

export interface MapSymbols {
  name: string
  href: string
  pointsFilter?: PointsFilter
  centroidsFilter?: CentroidsFilter
  midpointsFilter?: MidpointsFilter
  data?: Point[]
}

export function entryToVs({
  pointsFilter,
  centroidsFilter,
  midpointsFilter,
  data,
}: Readonly<MapSymbols>): Point[] {
  return [
    ...(pointsFilter !== undefined ? getPoints(pointsFilter) : []),
    ...(centroidsFilter !== undefined ? getCentroids(centroidsFilter) : []),
    ...(midpointsFilter !== undefined ? getMidpoints(midpointsFilter) : []),
    ...(data !== undefined ? data : []),
  ]
}

function getPoints(filter: PointsFilter): Point[] {
  return cfg.mapData.points.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

function getCentroids(filter: CentroidsFilter) {
  return cfg.mapData.centroids.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

function getMidpoints(filter: MidpointsFilter) {
  return cfg.mapData.midpoints.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

function conv(p: V): V {
  return vUnvec(cfg.mapCoord.fromGeo(vVec(p)))
}

export function RenderUses(
  props: Readonly<{ name: string; href: string; vs: V[] }>
) {
  return (
    <>
      {props.vs.map((_, j) => (
        <use key={j} className={`${props.name}-${j}`} href={props.href} />
      ))}
    </>
  )
}

export function RenderUseStyles(
  props: Readonly<{ name: string; href: string; vs: V[] }>
) {
  return (
    <>
      {props.vs.map(
        ([x, y], j) =>
          `
.${props.name} > .${props.name}-${j} {
transform: ${`translate(${x}px, ${y}px)`.replaceAll(/([.]\d\d)\d*/g, '$1')} scale(var(--map-symbol-size));
}
`
      )}
    </>
  )
}
