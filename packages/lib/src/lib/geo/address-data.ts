import { type OsmSearchProps } from '../../types'
import { type AddressEntries, type AddressEntry } from '../search/address-types'
import type { OsmProperties } from './osm-types'
import { getOsmId } from './search'
import type { SearchEntry } from './search-types'

function pointAddresses(
  props: Readonly<OsmSearchProps>,
  skip?: Readonly<RegExp>
): AddressEntries {
  return props.mapData.points.features.flatMap(({ properties }) => {
    const e = filterFeature(properties, props.searchEntries, skip)
    return e === null ? [] : [e]
  })
}

/*
function lineAddresses(
  props: Readonly<OsmSearchProps>,
  skip?: Readonly<RegExp>
): AddressEntries {
  return props.mapData.lines.features.flatMap(({ properties }) => {
    const e = filterFeature(properties, props.searchEntries, skip)
    return e === null ? [] : [e]
  })
}
*/

function polygonAddresses(
  props: Readonly<OsmSearchProps>,
  skip?: Readonly<RegExp>
): AddressEntries {
  return props.mapData.multipolygons.features.flatMap(({ properties }) => {
    const e = filterFeature(properties, props.searchEntries, skip)
    return e === null ? [] : [e]
  })
}

function filterFeature(
  properties: OsmProperties,
  entries: readonly SearchEntry[],
  skip?: Readonly<RegExp>
): null | AddressEntry {
  const id = getOsmId(properties)
  if (id === null) {
    return null
  }
  const name = properties.name
  if (name !== null && skip !== undefined && name.match(skip)) {
    return null
  }
  const { centroid_x, centroid_y } = properties
  if (centroid_x === null || centroid_y === null) {
    return null
  }
  const matches = entries.filter((entry) => entry.filter(properties))
  return matches.length === 0
    ? null
    : { a: id + '', coord: { x: centroid_x, y: centroid_y } }
}

export function getAddressEntries(
  props: Readonly<OsmSearchProps>
): AddressEntries {
  const skip = props.cartoConfig?.skipNamePattern
  return [
    ...pointAddresses(props, skip),
    //...lineAddresses(props, skip),
    ...polygonAddresses(props, skip),
  ]
}
