import {
  calcScale,
  CentroidsFilter,
  MapData,
  OsmPointProperties,
  OsmPolygonProperties,
  POI,
  Point,
  PointFeature,
  PointsFilter,
} from '@daijimaps/svgmapviewer/geo'
import { V, vUnvec, vVec } from '@daijimaps/svgmapviewer/tuple'
import areas from './data/areas.json'
import centroids from './data/map-centroids.json'
import lines from './data/map-lines.json'
import multilinestrings from './data/map-multilinestrings.json'
import multipolygons from './data/map-multipolygons.json'
import points from './data/map-points.json'
import measures from './data/measures.json'
import origin from './data/origin.json'
import trees from './data/trees.json'
import viewbox from './data/viewbox.json'

export { trees }

//// mapData

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

//// mapCoord
//// mapViewBox

export const { mapCoord, mapViewBox } = calcScale(mapData)

//// mapHtmlStyle
//// mapSymbols
//// mapNames

export const mapHtmlStyle = `
.poi-names {
  font-size: small;
}
.poi-names-item {
  position: absolute;
  padding: 0.5em;
  background-color: rgba(255, 255, 255, 0.5);
  text-align: center;
  border-radius: 5em;
}
.poi-symbols-item > p,
.poi-names-item > p {
  margin: 0;
}
.poi-symbols-item {
  font-size: 1.5em;
  color: white;
  background-color: black;
  border-radius: 0.05em;
}
.poi-symbols-item > p > span {
  display: block;
}
`

export const mapSymbols: POI[] = []

type PointOrCentroidFeature =
  | PointFeature<OsmPointProperties>
  | PointFeature<OsmPolygonProperties>

const pointNames: POI[] = mapData.points.features.flatMap((f) => {
  const name = filterName(f)
  const pos = vVec(conv(f.geometry.coordinates as unknown as V))
  return name === null ? [] : [{ name: splitName(name), pos, size: 1 }]
})

const centroidNames: POI[] = mapData.centroids.features.flatMap((f) => {
  const name = filterName(f)
  const pos = vVec(conv(f.geometry.coordinates as unknown as V))
  return name === null ? [] : [{ name: splitName(name), pos, size: 10 }]
})

export const mapNames: POI[] = [...pointNames, ...centroidNames]

function filterName(f: PointOrCentroidFeature): null | string {
  const name = f.properties.name
  if (name === null) {
    return null
  }
  if (f.properties.other_tags?.match(/"vending_machine"/)) {
    return null
  }
  if (
    name.match(/門$/) &&
    'osm_way_id' in f.properties &&
    f.properties.osm_way_id !== null
  ) {
    return null
  }
  if (
    name.match(
      /丁目$|町$|売店$|レストハウス|^新宿御苑$|センター|案内図$|Ticket|シラカシ/
    )
  ) {
    return null
  }
  // split name by keywords
  return name.replace(
    /(カフェ|レストラン|ミュージアム|センター|門衛所|御休所|休憩所|案内図)/,
    ' $1 '
  )
}

function splitName(s: string): string[] {
  return s
    .trim()
    .split(/  */)
    .map((s) => s.trim())
}

////  getAll

export interface AllFilters {
  points?: PointsFilter
  centroids?: CentroidsFilter
}

export function getAll({ points, centroids }: AllFilters): V[] {
  return [
    points === undefined ? [] : getPoints(points),
    centroids === undefined ? [] : getCentroids(centroids),
  ].flatMap((vs) => vs)
}

export function getPoints(filter: PointsFilter): Point[] {
  return mapData.points.features
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
