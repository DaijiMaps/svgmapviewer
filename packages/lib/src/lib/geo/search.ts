import { PointFeature } from './geojson-types'
import {
  OsmCentroidGeoJSON,
  OsmLineProperties,
  OsmMidpointGeoJSON,
  OsmPointGeoJSON,
  OsmPointProperties,
  OsmPolygonProperties,
} from './osm-types'

interface MapData {
  points: OsmPointGeoJSON
  centroids: OsmCentroidGeoJSON
  midpoints: OsmMidpointGeoJSON
}

export function findFeature(
  id: undefined | string,
  mapData: Readonly<MapData>
): null | PointFeature<
  OsmPointProperties | OsmLineProperties | OsmPolygonProperties
> {
  if (id === undefined) {
    return null
  }
  const ps = mapData.points.features.filter((f) => f.properties.osm_id === id)
  if (ps.length === 1) {
    return ps[0]
  }
  const cs = mapData.centroids.features.filter(
    (f) => f.properties.osm_id === id || f.properties.osm_way_id === id
  )
  if (cs.length === 1) {
    return cs[0]
  }
  const ms = mapData.midpoints.features.filter(
    (f) => f.properties.osm_id === id
  )
  if (ms.length === 1) {
    return ms[0]
  }
  return null
}

export function findProperties(
  id: undefined | string,
  mapData: Readonly<MapData>
): null | OsmPointProperties | OsmLineProperties | OsmPolygonProperties {
  if (id === undefined) {
    return null
  }
  const fs1 = mapData.points.features.filter((f) => f.properties.osm_id === id)
  if (fs1.length === 1) {
    return fs1[0].properties
  }
  const fs2 = mapData.centroids.features.filter(
    (f) => f.properties.osm_id === id || f.properties.osm_way_id === id
  )
  if (fs2.length === 1) {
    return fs2[0].properties
  }
  const fs3 = mapData.midpoints.features.filter(
    (f) => f.properties.osm_id === id
  )
  if (fs3.length === 1) {
    return fs3[0].properties
  }
  return null
}

export function getPropertyValue(
  properties: Readonly<
    OsmPointProperties | OsmLineProperties | OsmPolygonProperties
  >,
  key: string
): null | string {
  const re = new RegExp(`\\"${key}\\"=>\\"([^"][^"]*)\\"`)
  if (properties.other_tags === null) {
    return null
  }
  const res = re.exec(String(properties.other_tags))
  return res === null ? null : res[1]
}
