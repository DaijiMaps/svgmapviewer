import {
  calcScale,
  LineFeature,
  MapData,
  MultiPolygonFeature,
  OsmLineProperties,
  OsmPointProperties,
  OsmPolygonProperties,
  POI,
  PointFeature,
} from '@daijimaps/svgmapviewer/map'
import { V, vUnvec, vVec } from '@daijimaps/svgmapviewer/tuple'
import areas from './data/areas.json'
import centroids from './data/map-centroids.json'
import lines from './data/map-lines.json'
import multipolygons from './data/map-multipolygons.json'
import multilinestrings from './data/map-multistrings.json'
import points from './data/map-points.json'
import measures from './data/measures.json'
import origin from './data/origin.json'
import trees from './data/trees.json'
import viewbox from './data/viewbox.json'

export { trees }

export const mapData: MapData = {
  areas,
  origin,
  measures,
  viewbox,

  points,
  lines,
  multilinestrings,
  multipolygons,
  centroids,
}

export const { mapCoord, mapViewBox } = calcScale(mapData)

export const mapNames: POI[] = [mapData.points, mapData.centroids].flatMap(
  (d) =>
    d.features.flatMap(
      (
        f: PointFeature<OsmPointProperties> | PointFeature<OsmPolygonProperties>
      ) => {
        const name = f.properties.name
        const pos = vVec(conv(f.geometry.coordinates as unknown as V))
        return name === null ? [] : [{ name: splitName(name), pos }]
      }
    )
)

function splitName(s: string): string[] {
  return s
    .trim()
    .split(/  */)
    .map((s) => s.trim())
}

type PointsFilter = (f: PointFeature<OsmPointProperties>) => boolean
type LinesFilter = (f: LineFeature<OsmLineProperties>) => boolean
type MultiPolygonsFilter = (
  f: MultiPolygonFeature<OsmPolygonProperties>
) => boolean
type CentroidsFilter = (f: PointFeature<OsmPolygonProperties>) => boolean

interface Filters {
  points?: PointsFilter
  lines?: LinesFilter
  multipolygons?: MultiPolygonsFilter
  centroids?: CentroidsFilter
}

export function getAll({ points, lines, multipolygons, centroids }: Filters) {
  return [
    points === undefined ? [] : getPoints(points),
    lines === undefined ? [] : getLines(lines),
    multipolygons === undefined ? [] : getMultiPolygons(multipolygons),
    centroids === undefined ? [] : getCentroids(centroids),
  ].flatMap((vs) => vs)
}

export function getPoints(filter: PointsFilter) {
  return mapData.points.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}
export function getLines(filter: LinesFilter) {
  return mapData.lines.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}
export function getMultiPolygons(filter: MultiPolygonsFilter) {
  return mapData.multipolygons.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}
export function getCentroids(filter: CentroidsFilter) {
  return mapData.centroids.features
    .filter(filter)
    .map((f) => f.geometry.coordinates as unknown as V)
    .map(conv)
}

export function conv(p: V): V {
  return vUnvec(mapCoord.fromGeo(vVec(p)))
}
