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

export const mapHtmlStyle = `
poi-names {
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

/*
`
@font-face {
  font-family: 'aiga';
  src: url('aiga.eot?t=1728818923481');
  src:
    url('aiga.eot?t=1728818923481#iefix') format('embedded-opentype'),
    url('aiga.woff2?t=1728818923481') format('woff2'),
    url('aiga.woff?t=1728818923481') format('woff'),
    url('aiga.ttf?t=1728818923481') format('truetype'),
    url('aiga.svg?t=1728818923481#aiga') format('svg');
}

[class^='aiga-'],
[class*=' aiga-'] {
  font-family: 'aiga' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.aiga-toilets:before {
  content: '\\ea01';
}
`
*/

export const mapSymbols: POI[] = [mapData.points, mapData.centroids].flatMap(
  (d) =>
    d.features.flatMap(
      (
        f: PointFeature<OsmPointProperties> | PointFeature<OsmPolygonProperties>
      ) => {
        //const pos = vVec(conv(f.geometry.coordinates as unknown as V))

        if (
          !!f.properties.other_tags?.match(/"toilets"/) ||
          ('amenity' in f.properties && f.properties.amenity === 'toilets')
        ) {
          //return [{ name: ['aiga-toilets'], pos }]
          return []
        } else {
          return []
        }
      }
    )
)

export const mapNames: POI[] = [mapData.points, mapData.centroids].flatMap(
  (d) =>
    d.features.flatMap(
      (
        f: PointFeature<OsmPointProperties> | PointFeature<OsmPolygonProperties>
      ) => {
        const name = filterName(f)
        const pos = vVec(conv(f.geometry.coordinates as unknown as V))
        return name === null ? [] : [{ name: splitName(name), pos }]
      }
    )
)

function filterName(
  f: PointFeature<OsmPointProperties> | PointFeature<OsmPolygonProperties>
): null | string {
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
