import { Array, pipe, Result } from 'effect'

import {
  type LineMap,
  type MultiLineStringMap,
  type MultiPolygonMap,
  type OsmMapData,
  type OsmMapMap,
  type PointMap,
} from './data-types'
import {
  type OsmLineStringGeoJSON,
  type OsmMultiLineStringGeoJSON,
  type OsmMultiPolygonGeoJSON,
  type OsmPointGeoJSON,
} from './osm-types'

export function mapMapFromMapData(mapData: Readonly<OsmMapData>): OsmMapMap {
  return {
    pointMap: pointMapFromGeoJSON(mapData.points),
    lineMap: lineMapFromGeoJSON(mapData.lines),
    multilinestringMap: multiLineStringMapFromGeoJSON(mapData.multilinestrings),
    multipolygonMap: multiPolygonMapFromGeoJSON(mapData.multipolygons),
  }
}

function pointMapFromGeoJSON(points: Readonly<OsmPointGeoJSON>): PointMap {
  return pipe(
    points.features,
    Array.filterMap((f) => {
      const osm_id = f.properties.osm_id
      return osm_id === null
        ? Result.failVoid
        : Result.succeed([Number(osm_id), f] as const)
    }),
    (xs) => new Map(xs)
  )
}

function lineMapFromGeoJSON(lines: Readonly<OsmLineStringGeoJSON>): LineMap {
  return pipe(
    lines.features,
    Array.filterMap((f) => {
      const osm_id = f.properties.osm_id
      return osm_id === null
        ? Result.failVoid
        : Result.succeed([Number(osm_id), f] as const)
    }),
    (xs) => new Map(xs)
  )
}

function multiLineStringMapFromGeoJSON(
  multilinestrings: Readonly<OsmMultiLineStringGeoJSON>
): MultiLineStringMap {
  return pipe(
    multilinestrings.features,
    Array.filterMap((f) => {
      const osm_id = f.properties.osm_id
      return osm_id === null
        ? Result.failVoid
        : Result.succeed([Number(osm_id), f] as const)
    }),
    (xs) => new Map(xs)
  )
}

function multiPolygonMapFromGeoJSON(
  multipolygons: Readonly<OsmMultiPolygonGeoJSON>
): MultiPolygonMap {
  return pipe(
    multipolygons.features,
    Array.filterMap((f) => {
      const osm_id = f.properties.osm_id
      const osm_way_id = f.properties.osm_way_id
      const id =
        osm_id !== null ? osm_id : osm_way_id !== null ? osm_way_id : null
      return id === null
        ? Result.failVoid
        : Result.succeed([Number(id), f] as const)
    }),
    (xs) => new Map(xs)
  )
}
