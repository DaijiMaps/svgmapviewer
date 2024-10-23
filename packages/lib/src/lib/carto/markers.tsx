import { svgMapViewerConfig } from '../config'
import { CentroidsFilter, Point, PointsFilter } from '../geo'
import { V, vUnvec, vVec } from '../tuple'
import { RenderMapProps } from '../types'

export interface RenderMapMarkersProps extends RenderMapProps {
  mapMarkers: MapMarkers[]
}

export function RenderMapMarkers(props: Readonly<RenderMapMarkersProps>) {
  const { config, svgScale } = props.layout
  const sz = svgScale.s * config.fontSize * 0.9

  return (
    <g>
      {props.mapMarkers.map((entry, i) => (
        <g key={i}>
          <RenderMarkers sz={sz} name={entry.name} vs={entryToVs(entry)} />
        </g>
      ))}
    </g>
  )
}

export interface MapMarkers {
  name: string
  pointsFilter?: PointsFilter
  centroidsFilter?: CentroidsFilter
  data?: Point[]
}

export function entryToVs({
  pointsFilter,
  centroidsFilter,
  data,
}: Readonly<MapMarkers>): Point[] {
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

export function RenderMarkers(
  props: Readonly<{ sz: number; name: string; vs: V[] }>
) {
  const h = (props.sz * 1.5) / 2
  const r = Math.sqrt(2) * h
  return (
    <path
      className={props.name}
      fill="white"
      fillOpacity="1"
      stroke="gray"
      strokeWidth={r / 20}
      d={props.vs
        .map(
          ([x, y]) => `M ${x},${y} l ${-h},${-h} a ${r},${r} 0,1,1 ${2 * h},0 z`
        )
        .join('')}
    />
  )
}
