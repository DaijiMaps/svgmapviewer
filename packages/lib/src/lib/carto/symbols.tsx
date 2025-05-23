import { Fragment } from 'react/jsx-runtime'
import { svgMapViewerConfig as cfg } from '../config'
import { CentroidsFilter, MidpointsFilter, Point, PointsFilter } from '../geo'
import { V, vUnvec, vVec } from '../tuple'

export interface RenderMapSymbolsProps {
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
