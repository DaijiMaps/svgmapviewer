/* eslint-disable functional/prefer-immutable-types */
import {
  getOsmId,
  type MapData,
  type OsmFeature,
  type SearchEntry,
} from '../geo'
import type { AddressEntries, AddressEntry } from './address'

const pointAddresses = (
  mapData: MapData,
  entries: SearchEntry[]
): AddressEntries =>
  mapData.points.features.flatMap((f) => {
    const e = filterFeature(entries, f)
    return e === null ? [] : [e]
  })

const polygonAddresses = (
  mapData: MapData,
  entries: SearchEntry[]
): AddressEntries =>
  mapData.multipolygons.features.flatMap((f) => {
    const e = filterFeature(entries, f)
    return e === null ? [] : [e]
  })

export function getAddressEntries(
  mapData: MapData,
  entries: SearchEntry[]
): AddressEntries {
  return [
    ...pointAddresses(mapData, entries),
    ...polygonAddresses(mapData, entries),
  ]
}

function filterFeature(
  entries: SearchEntry[],
  { properties }: OsmFeature
): null | AddressEntry {
  const id = getOsmId(properties)
  if (id === null) {
    return null
  }
  const { centroid_x, centroid_y } = properties
  if (centroid_x === null || centroid_y === null) {
    return null
  }
  const matches = entries.filter((entry) => entry.filter(properties))
  return matches.length === 0
    ? null
    : { a: id + '', lonlat: { x: centroid_x, y: centroid_y } }
}
