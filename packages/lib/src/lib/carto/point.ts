import { svgMapViewerConfig as cfg } from '../config'
import {
  type LinesFilter,
  type MultiPolygonsFilter,
  type OsmFeature,
  type Point,
  type PointsFilter,
} from '../geo'
import type {
  OsmLineFeature,
  OsmMultiPolygonFeature,
  OsmPointFeature,
} from '../geo/osm-types'
import { type V, vUnvec, vV, vVec } from '../tuple'
import type { WithFilters } from './types'

export function entryToVs({
  pointsFilter,
  polygonsFilter,
  linesFilter,
  data,
}: Readonly<WithFilters>): Point[] {
  const mapData = cfg.mapData
  const points =
    pointsFilter === undefined
      ? []
      : getPoints(mapData.points.features, pointsFilter)
  const lines =
    linesFilter === undefined
      ? []
      : getLines(mapData.lines.features, linesFilter)
  const polygons =
    polygonsFilter === undefined
      ? []
      : getPolygons(mapData.multipolygons.features, polygonsFilter)
  const others = data === undefined ? [] : data
  return [...points, ...lines, ...polygons, ...others]
}

function getPoints(
  features: readonly OsmPointFeature[],
  filter: PointsFilter
): Point[] {
  return features
    .filter((f) => filter(f.properties))
    .flatMap(fToV)
    .map(conv)
}

function getLines(
  features: readonly OsmLineFeature[],
  filter: LinesFilter
): Point[] {
  return features
    .filter((f) => filter(f.properties))
    .flatMap(fToV)
    .map(conv)
}

function getPolygons(
  features: readonly OsmMultiPolygonFeature[],
  filter: MultiPolygonsFilter
): Point[] {
  return features
    .filter((f) => filter(f.properties))
    .flatMap(fToV)
    .map(conv)
}

function fToV(f: OsmFeature): V[] {
  const x = f.properties.centroid_x
  const y = f.properties.centroid_y
  return x === null || y === null ? [] : [vV(x, y)]
}

// XXX
// XXX
// XXX
function conv(p: V): V {
  return vUnvec(cfg.mapCoord.matrix.transformPoint(vVec(p)))
}
// XXX
// XXX
// XXX
