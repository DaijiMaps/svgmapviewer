import { svgMapViewerConfig } from '../config'
import { CentroidsFilter, Point, PointsFilter } from '../geo'
import { V, vUnvec, vVec } from '../tuple'
import { RenderMapProps } from '../types'

export interface RenderMapSymbolsProps extends RenderMapProps {
  mapSymbols: MapSymbols[]
}

export function RenderMapSymbols(props: Readonly<RenderMapSymbolsProps>) {
  const { config, svgScale } = props.layout
  const sz = config.fontSize * svgScale.s * 1.5

  return (
    <g>
      {props.mapSymbols.map((entry, i) => (
        <g key={i}>
          <RenderUses
            sz={sz}
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
  data?: Point[]
}

export function entryToVs({
  pointsFilter,
  centroidsFilter,
  data,
}: Readonly<MapSymbols>): Point[] {
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
          transform={`translate(${x}, ${y}) scale(${props.sz / 72})`}
        />
      ))}
    </>
  )
}
