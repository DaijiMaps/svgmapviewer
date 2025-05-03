import { svgMapViewerConfig as cfg } from '../config'
import { OsmPointProperties, OsmPolygonProperties } from './osm-types'

export function findProperties(
  id: undefined | string
): null | OsmPointProperties | OsmPolygonProperties {
  if (id === undefined) {
    return null
  }
  const fs1 = cfg.mapData.points.features.filter(
    (f) => f.properties.osm_id === id
  )
  if (fs1.length === 1) {
    return fs1[0].properties
  }
  const fs2 = cfg.mapData.centroids.features.filter(
    (f) => f.properties.osm_id === id
  )
  if (fs2.length === 1) {
    return fs2[0].properties
  }
  const fs3 = cfg.mapData.centroids.features.filter(
    (f) => f.properties.osm_way_id === id
  )
  if (fs3.length === 1) {
    return fs3[0].properties
  }
  return null
}

export function getPropertyValue(
  properties: Readonly<OsmPointProperties | OsmPolygonProperties>,
  key: string
): null | string {
  const re = new RegExp(`\\"${key}\\"=>\\"([^"][^"]*)\\"`)
  const res = re.exec(properties.other_tags ?? '')
  return res === null ? null : res[1]
}
