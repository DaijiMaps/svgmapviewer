import { useSelector } from '@xstate/react'
import { svgMapViewerConfig as cfg } from '../config'
import {
  type CentroidsFilter,
  type MidpointsFilter,
  type Point,
  type PointsFilter,
} from '../geo'
import {
  renderMapActor,
  selectLayoutConfig,
  selectLayoutSvgScaleS,
} from '../map-xstate'
import { type V, vUnvec, vVec } from '../tuple'

export interface RenderMapMarkersProps {
  mapMarkers: MapMarkers[]
}

export function RenderMapMarkers(props: Readonly<RenderMapMarkersProps>) {
  const config = useSelector(renderMapActor, selectLayoutConfig)
  const s = useSelector(renderMapActor, selectLayoutSvgScaleS)

  const sz = s * config.fontSize * 0.9

  return (
    <g className="map-markers">
      {props.mapMarkers.map((entry, i) => (
        <g key={i}>
          <RenderMarkers sz={sz} name={entry.name} vs={entryToVs(entry)} />
        </g>
      ))}
    </g>
  )
}

export interface MapMarker {
  name: string
  href: string
  data?: Point
}

export interface MapMarkers {
  name: string
  pointsFilter?: PointsFilter
  centroidsFilter?: CentroidsFilter
  midpointsFilter?: MidpointsFilter
  data?: MapMarker[]
}

export function entryToVs({
  pointsFilter,
  centroidsFilter,
  midpointsFilter,
  data,
}: Readonly<MapMarkers>): MapMarker[] {
  return [
    ...(pointsFilter !== undefined ? getPoints(pointsFilter) : []),
    ...(centroidsFilter !== undefined ? getCentroids(centroidsFilter) : []),
    ...(midpointsFilter !== undefined ? getMidpoints(midpointsFilter) : []),
    ...(data !== undefined ? data : []),
  ]
}

function getPoints(filter: PointsFilter): MapMarker[] {
  return cfg.mapData.points.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
    .map((v) => ({ name: '', href: '', data: v }))
}

function getCentroids(filter: CentroidsFilter): MapMarker[] {
  return cfg.mapData.centroids.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
    .map((v) => ({ name: '', href: '', data: v }))
}

function getMidpoints(filter: MidpointsFilter): MapMarker[] {
  return cfg.mapData.midpoints.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
    .map((v) => ({ name: '', href: '', data: v }))
}

function conv(p: V): V {
  return vUnvec(cfg.mapCoord.fromGeo(vVec(p)))
}

export function RenderMarkers(
  props: Readonly<{ sz: number; name: string; vs: MapMarker[] }>
) {
  const h = (props.sz * 1.5) / 2
  const r = Math.sqrt(2) * h
  return (
    <>
      {props.vs
        .flatMap((m) =>
          m.data === undefined
            ? []
            : [{ name: m.name, href: m.href, x: m.data[0], y: m.data[1] }]
        )
        .map(({ name, x, y }, idx) => (
          <path
            key={idx}
            className={name}
            fill="white"
            fillOpacity="1"
            stroke="gray"
            strokeWidth={r / 20}
            d={`M 0,0 l ${-h},${-h} a ${r},${r} 0,1,1 ${2 * h},0 z`.replaceAll(
              /([.]\d\d)\d*/g,
              '$1'
            )}
            style={{
              transform: `translate(${x}px, ${y}px)`.replaceAll(
                /([.]\d\d)\d*/g,
                '$1'
              ),
            }}
          />
        ))}
    </>
  )
}

export function RenderMarker(
  props: Readonly<{ sz: number; name: string; m: MapMarker; o: V }>
) {
  const { name } = props.m
  const [x, y] = props.o
  const h = 1
  const r = Math.sqrt(2) * h
  return (
    <path
      className={name}
      fill="white"
      fillOpacity="1"
      stroke="gray"
      strokeWidth={r / 20}
      d={`M ${x},${y} l ${-h},${-h} a ${r},${r} 0,1,1 ${2 * h},0 z`.replaceAll(
        /([.]\d\d)\d*/g,
        '$1'
      )}
    />
  )
}
