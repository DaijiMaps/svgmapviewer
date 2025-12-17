import type { Info } from '../../types'
import type { SearchPos } from '../search'
import { type OsmMapMap } from './data-types'
import { type OsmFeature, type OsmProperties } from './osm-types'
import type { OsmSearchEntry } from './search-types'

export function findFeature(
  id: undefined | number,
  mapMap: Readonly<OsmMapMap>
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

export function findProperties(
  id: undefined | number,
  mapMap: Readonly<OsmMapMap>
): null | OsmProperties {
  return findFeature(id, mapMap)?.properties ?? null
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

export function getSearchInfo(
  res: Readonly<SearchPos>,
  mapMap?: Readonly<OsmMapMap>,
  entries?: readonly OsmSearchEntry[]
): null | Info {
  if (mapMap === undefined || entries === undefined) {
    return null
  }
  const id = Number(res.address)
  const feature = findFeature(id, mapMap)
  if (feature === null) {
    return null
  }
  const properties = feature.properties
  const matches = entries.flatMap((entry) =>
    !entry.filter(properties) ? [] : [entry.getInfo(properties, res.address)]
  )
  return matches.length === 0 ? null : matches[0]
}
