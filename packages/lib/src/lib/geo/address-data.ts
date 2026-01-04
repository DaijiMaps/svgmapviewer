import type { OsmProperties } from './osm-types'
import type { OsmSearchEntry } from './search-types'

import { type OsmSearchProps } from '../../types'
import { type SearchPos } from '../search/types'
import { getOsmId } from './search'

function pointAddresses(
  props: Readonly<OsmSearchProps>,
  skip?: Readonly<RegExp>
): readonly SearchPos[] {
  return props.mapData.points.features
    .map(({ properties }) =>
      filterFeature(properties, props.osmSearchEntries, skip)
    )
    .filter((e) => e !== null)
}

/*
function lineAddresses(
  props: Readonly<OsmSearchProps>,
  skip?: Readonly<RegExp>
): readonly SearchPos[] {
  return props.mapData.lines.features
    .map(({ properties }) =>
      filterFeature(properties, props.osmSearchEntries, skip)
    )
    .filter((e) => e !== null)
}
*/

function polygonAddresses(
  props: Readonly<OsmSearchProps>,
  skip?: Readonly<RegExp>
): readonly SearchPos[] {
  return props.mapData.multipolygons.features
    .map(({ properties }) =>
      filterFeature(properties, props.osmSearchEntries, skip)
    )
    .filter((e) => e !== null)
}

function filterFeature(
  properties: OsmProperties,
  entries: readonly OsmSearchEntry[],
  skip?: Readonly<RegExp>
): null | SearchPos {
  const id = getOsmId(properties)
  if (id === null) {
    return null
  }
  // 1. name
  const name = properties.name
  if (name !== null && skip !== undefined && name.match(skip)) {
    return null
  }
  // 2. centroid
  const { centroid_x, centroid_y } = properties
  if (centroid_x === null || centroid_y === null) {
    return null
  }
  // 3. entry filter
  // XXX slow
  // XXX fidx
  const matches = entries.filter((entry) => entry.filter(properties))
  return matches.length === 0
    ? null
    : { address: id + '', fidx: 0, coord: { x: centroid_x, y: centroid_y } }
}

export function osmGetSearchEntries(
  props: Readonly<OsmSearchProps>
): SearchPos[] {
  const skip = props.cartoConfig?.skipNamePattern
  return [
    ...pointAddresses(props, skip),
    //...lineAddresses(props, skip),
    ...polygonAddresses(props, skip),
  ]
}
