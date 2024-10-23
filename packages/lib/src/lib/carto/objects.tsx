import { svgMapViewerConfig } from '../config'
import { CentroidsFilter, Point, PointsFilter } from '../geo'
import { V, vUnvec, vVec } from '../tuple'

export function RenderMapObjects(
  props: Readonly<{
    mapObjects: MapObjects[]
  }>
) {
  return (
    <g>
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

export interface MapObjects {
  name: string
  path: string
  width: number
  pointsFilter?: PointsFilter
  centroidsFilter?: CentroidsFilter
  data?: Point[]
}

export function entryToVs({
  pointsFilter,
  centroidsFilter,
  data,
}: Readonly<MapObjects>): Point[] {
  return [
    ...(pointsFilter !== undefined ? getPoints(pointsFilter) : []),
    ...(centroidsFilter !== undefined ? getCentroids(centroidsFilter) : []),
    ...(data !== undefined ? data : []),
  ]
}

function getPoints(filter: PointsFilter): Point[] {
  return svgMapViewerConfig.mapData.points.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

function getCentroids(filter: CentroidsFilter) {
  return svgMapViewerConfig.mapData.centroids.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

function conv(p: V): V {
  return vUnvec(svgMapViewerConfig.mapCoord.fromGeo(vVec(p)))
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
      d={props.vs.map(([x, y]) => `M ${x},${y}` + props.path).join('')}
    />
  )
}
