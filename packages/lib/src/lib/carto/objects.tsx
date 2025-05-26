import { svgMapViewerConfig as cfg } from '../config'
import {
  type CentroidsFilter,
  type MidpointsFilter,
  type Point,
  type PointsFilter,
} from '../geo'
import { type V, vUnvec, vVec } from '../tuple'

export function RenderMapObjects(
  props: Readonly<{
    mapObjects: MapObjects[]
  }>
) {
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

// XXX take size (width/height)
// XXX calc stroke-width (0.05% of width/height)
export interface MapObjects {
  name: string
  path: string
  width: number
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
}: Readonly<MapObjects>): Point[] {
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

export function RenderObjects(
  props: Readonly<{ name: string; width: number; path: string; vs: V[] }>
) {
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
