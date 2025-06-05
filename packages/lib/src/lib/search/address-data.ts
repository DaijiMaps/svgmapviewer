/* eslint-disable functional/prefer-immutable-types */
import {
  findFeature2,
  getOsmId,
  type MapData,
  type MapMap,
  type OsmFeature,
  type SearchEntry,
} from '../geo'
import type { Info } from '../types'
import type { AddressEntries, AddressEntry, SearchAddressRes } from './address'

const pointAddresses = (
  mapData: MapData,
  entries: SearchEntry[]
): AddressEntries =>
  mapData.points.features.flatMap((f) => {
    const e = filterFeature(entries, f)
    return e === null ? [] : [e]
  })

const lineAddresses = (
  mapData: MapData,
  entries: SearchEntry[]
): AddressEntries =>
  mapData.lines.features.flatMap((f) => {
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
    ...lineAddresses(mapData, entries),
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

export function getAddressInfo(
  mapMap: MapMap,
  entries: SearchEntry[],
  res: SearchAddressRes
): null | Info {
  const id = Number(res.address)
  const feature = findFeature2(id, mapMap)
  if (feature === null) {
    return null
  }
  const properties = feature.properties
  const matches = entries.flatMap((entry) =>
    !entry.filter(properties) ? [] : [entry.getInfo(properties, res.address)]
  )
  return matches.length === 0 ? null : matches[0]
}
