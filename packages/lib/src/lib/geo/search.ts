/* eslint-disable functional/prefer-immutable-types */
import { type MapData, type MapMap } from './data-types'
import { type OsmFeature, type OsmProperties } from './osm-types'

export function findFeature2(
  id: undefined | number,
  mapMap: Readonly<MapMap>
): null | OsmFeature {
  if (id === undefined) {
    return null
  }
  const ps = mapMap.pointMap.get(id)
  if (ps !== undefined) {
    return ps
  }
  const ms = mapMap.lineMap.get(id)
  if (ms !== undefined) {
    return ms
  }
  const cs = mapMap.multipolygonMap.get(id)
  if (cs !== undefined) {
    return cs
  }
  return null
}

export function findFeature(
  id: undefined | string,
  mapData: Readonly<MapData>
): null | OsmFeature {
  if (id === undefined) {
    return null
  }
  const ps = mapData.points.features.filter((f) => f.properties.osm_id === id)
  if (ps.length === 1) {
    return ps[0]
  }
  const cs = mapData.multipolygons.features.filter(
    (f) => f.properties.osm_id === id || f.properties.osm_way_id === id
  )
  if (cs.length === 1) {
    return cs[0]
  }
  const ms = mapData.lines.features.filter((f) => f.properties.osm_id === id)
  if (ms.length === 1) {
    return ms[0]
  }
  return null
}

export function findProperties2(
  id: undefined | number,
  mapMap: Readonly<MapMap>
): null | OsmProperties {
  if (id === undefined) {
    return null
  }
  const fs1 = mapMap.pointMap.get(id)
  if (fs1 !== undefined) {
    return fs1.properties
  }
  const fs3 = mapMap.lineMap.get(id)
  if (fs3 !== undefined) {
    return fs3.properties
  }
  const fs2 = mapMap.multipolygonMap.get(id)
  if (fs2 !== undefined) {
    return fs2.properties
  }
  return null
}

export function findProperties(
  id: undefined | string,
  mapData: Readonly<MapData>
): null | OsmProperties {
  if (id === undefined) {
    return null
  }
  const fs1 = mapData.points.features.filter((f) => f.properties.osm_id === id)
  if (fs1.length === 1) {
    return fs1[0].properties
  }
  const fs2 = mapData.multipolygons.features.filter(
    (f) => f.properties.osm_id === id || f.properties.osm_way_id === id
  )
  if (fs2.length === 1) {
    return fs2[0].properties
  }
  const fs3 = mapData.lines.features.filter((f) => f.properties.osm_id === id)
  if (fs3.length === 1) {
    return fs3[0].properties
  }
  return null
}

export function getOsmId(properties: Readonly<OsmProperties>): null | number {
  const id =
    'osm_id' in properties && typeof properties['osm_id'] === 'string'
      ? properties['osm_id']
      : 'osm_way_id' in properties &&
          typeof properties['osm_way_id'] === 'string'
        ? properties['osm_way_id']
        : null
  return id === null ? null : Number(id)
}

export function getPropertyValue(
  properties: Readonly<OsmProperties>,
  key: string
): null | string {
  const re = new RegExp(`\\"${key}\\"=>\\"([^"][^"]*)\\"`)
  if (properties.other_tags === null) {
    return null
  }
  const res = re.exec(String(properties.other_tags))
  return res === null ? null : res[1]
}
