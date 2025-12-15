import {
  type LinesFilter,
  type MapData,
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
import { type V, vV } from '../tuple'
import type { WithFilters } from './types'

export function entryToVs(
  mapData: Readonly<MapData>,
  { pointsFilter, polygonsFilter, linesFilter, data }: Readonly<WithFilters>
): Point[] {
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
  return features.filter((f) => filter(f.properties)).flatMap(fToV)
}

function getLines(
  features: readonly OsmLineFeature[],
  filter: LinesFilter
): Point[] {
  return features.filter((f) => filter(f.properties)).flatMap(fToV)
}

function getPolygons(
  features: readonly OsmMultiPolygonFeature[],
  filter: MultiPolygonsFilter
): Point[] {
  return features.filter((f) => filter(f.properties)).flatMap(fToV)
}

function fToV(f: OsmFeature): V[] {
  const x = f.properties.centroid_x
  const y = f.properties.centroid_y
  return x === null || y === null ? [] : [vV(x, y)]
}
