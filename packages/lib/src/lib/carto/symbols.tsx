import { svgMapViewerConfig as cfg } from '../config'
import { CentroidsFilter, MidpointsFilter, Point, PointsFilter } from '../geo'
import { V, vUnvec, vVec } from '../tuple'
import { RenderMapProps } from '../types'

export interface RenderMapSymbolsProps extends RenderMapProps {
  mapSymbols: MapSymbols[]
}

export function RenderMapSymbols(props: Readonly<RenderMapSymbolsProps>) {
  const { config, svgScale } = props.layout

  return (
    <g className="map-symbols">
      {props.mapSymbols.map((entry, i) => (
        <g key={i}>
          <RenderUses
            sz={
              config.fontSize *
              (0.8 + 0.2 * Math.log2(Math.max(1, props.zoom))) *
              svgScale.s
            }
            name={entry.name}
            href={entry.href}
            vs={entryToVs(entry)}
          />
        </g>
      ))}
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
  props: Readonly<{ name: string; href: string; vs: V[]; sz: number }>
) {
  return (
    <>
      {props.vs.map(([x, y], j) => (
        <use
          key={j}
          className={props.name}
          href={props.href}
          transform={
            `translate(${x}, ${y})`.replaceAll(/([.]\d\d)\d*/g, '$1') +
            `scale(${props.sz / 72})`
          }
        />
      ))}
    </>
  )
}
