import { option, readonlyArray } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import type { Option } from 'fp-ts/lib/Option'
import type {
  CentroidMap,
  LineMap,
  MapData,
  MapMap,
  MidpointMap,
  MultiLineStringMap,
  MultiPolygonMap,
  PointMap,
} from './data-types'
import type {
  OsmCentroidFeature,
  OsmCentroidGeoJSON,
  OsmLineFeature,
  OsmLineGeoJSON,
  OsmMidpointFeature,
  OsmMidpointGeoJSON,
  OsmMultiLineStringFeature,
  OsmMultiLineStringGeoJSON,
  OsmMultiPolygonFeature,
  OsmMultiPolygonGeoJSON,
  OsmPointFeature,
  OsmPointGeoJSON,
} from './osm-types'

export function mapMapFromMapData(mapData: Readonly<MapData>): MapMap {
  return {
    pointMap: pointMapFromGeoJSON(mapData.points),
    lineMap: lineMapFromGeoJSON(mapData.lines),
    multilinestringMap: multiLineStringMapFromGeoJSON(mapData.multilinestrings),
    multipolygonMap: multiPolygonMapFromGeoJSON(mapData.multipolygons),
    midpointMap: midpointMapFromGeoJSON(mapData.midpoints),
    centroidMap: centroidMapFromGeoJSON(mapData.centroids),
  }
}

function pointMapFromGeoJSON(points: Readonly<OsmPointGeoJSON>): PointMap {
  return pipe(
    points.features,
    readonlyArray.filterMap((f): Option<[number, OsmPointFeature]> => {
      const osm_id = f.properties.osm_id
      return osm_id === null ? option.none : option.some([Number(osm_id), f])
    }),
    Object.fromEntries
  )
}

function lineMapFromGeoJSON(lines: Readonly<OsmLineGeoJSON>): LineMap {
  return pipe(
    lines.features,
    readonlyArray.filterMap((f): Option<[number, OsmLineFeature]> => {
      const osm_id = f.properties.osm_id
      return osm_id === null ? option.none : option.some([Number(osm_id), f])
    }),
    Object.fromEntries
  )
}

function multiLineStringMapFromGeoJSON(
  multilinestrings: Readonly<OsmMultiLineStringGeoJSON>
): MultiLineStringMap {
  return pipe(
    multilinestrings.features,
    readonlyArray.filterMap(
      (f): Option<[number, OsmMultiLineStringFeature]> => {
        const osm_id = f.properties.osm_id
        return osm_id === null ? option.none : option.some([Number(osm_id), f])
      }
    ),
    Object.fromEntries
  )
}

function multiPolygonMapFromGeoJSON(
  multipolygons: Readonly<OsmMultiPolygonGeoJSON>
): MultiPolygonMap {
  return pipe(
    multipolygons.features,
    readonlyArray.filterMap((f): Option<[number, OsmMultiPolygonFeature]> => {
      const osm_id = f.properties.osm_id
      const osm_way_id = f.properties.osm_way_id
      const id =
        osm_id !== null ? osm_id : osm_way_id !== null ? osm_way_id : null
      return id === null ? option.none : option.some([Number(id), f])
    }),
    Object.fromEntries
  )
}

function midpointMapFromGeoJSON(
  midpoints: Readonly<OsmMidpointGeoJSON>
): MidpointMap {
  return pipe(
    midpoints.features,
    readonlyArray.filterMap((f): Option<[number, OsmMidpointFeature]> => {
      const osm_id = f.properties.osm_id
      return osm_id === null ? option.none : option.some([Number(osm_id), f])
    }),
    Object.fromEntries
  )
}

function centroidMapFromGeoJSON(
  centroids: Readonly<OsmCentroidGeoJSON>
): CentroidMap {
  return pipe(
    centroids.features,
    readonlyArray.filterMap((f): Option<[number, OsmCentroidFeature]> => {
      const osm_id = f.properties.osm_id
      const osm_way_id = f.properties.osm_way_id
      const id =
        osm_id !== null
          ? osm_id
          : osm_way_id !== null
            ? osm_way_id
            : option.none
      return id === null ? option.none : option.some([Number(id), f])
    }),
    Object.fromEntries
  )
}
