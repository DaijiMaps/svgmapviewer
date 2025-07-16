/* eslint-disable functional/prefer-immutable-types */
import { svgMapViewerConfig } from '../../config'
import {
  findFeature,
  getOsmId,
  type MapData,
  type MapMap,
  type OsmProperties,
  type SearchEntry,
} from '../geo'
import type { Info } from '../types'
import type {
  AddressEntries,
  AddressEntry,
  SearchAddressRes,
} from './address-types'

const pointAddresses = (
  mapData: MapData,
  entries: SearchEntry[],
  skip?: Readonly<RegExp>
): AddressEntries =>
  mapData.points.features.flatMap(({ properties }) => {
    const e = filterFeature(properties, entries, skip)
    return e === null ? [] : [e]
  })

/*
const lineAddresses = (
  mapData: MapData,
  entries: SearchEntry[],
  skip?: Readonly<RegExp>
): AddressEntries =>
  mapData.lines.features.flatMap(({ properties }) => {
    const e = filterFeature(properties, entries, skip)
    return e === null ? [] : [e]
  })
*/

const polygonAddresses = (
  mapData: MapData,
  entries: SearchEntry[],
  skip?: Readonly<RegExp>
): AddressEntries =>
  mapData.multipolygons.features.flatMap(({ properties }) => {
    const e = filterFeature(properties, entries, skip)
    return e === null ? [] : [e]
  })

export function getAddressEntries(
  mapData: MapData,
  entries: SearchEntry[]
): AddressEntries {
  const skip = svgMapViewerConfig.cartoConfig?.skipNamePattern
  return [
    ...pointAddresses(mapData, entries, skip),
    //...lineAddresses(mapData, entries, skip),
    ...polygonAddresses(mapData, entries, skip),
  ]
}

function filterFeature(
  properties: OsmProperties,
  entries: SearchEntry[],
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
    : { a: id + '', lonlat: { x: centroid_x, y: centroid_y } }
}

export function getAddressInfo(
  mapMap: MapMap,
  entries: SearchEntry[],
  res: SearchAddressRes
): null | Info {
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
