import { getCollection, getEntry } from 'astro:content'
import type { SearchAddress, SearchName } from 'svgmapviewer/address'

const tmpFloors = await getEntry('floors', 'default')

const searchAddresses: readonly SearchAddress[] = await getCollection(
  'addresses'
).then((xs) => xs.map(({ id, data }) => ({ address: id, floorPos: data })))

const searchNames: readonly SearchName[] = await getCollection('names').then(
  (xs) => xs.map(({ id, data }) => ({ name: id, addresses: data }))
)

// XXX pois

const tmpConfig = await getEntry('svgMapViewerConfig', 'default')

export const config = {
  ...(tmpConfig === undefined ? {} : tmpConfig.data),
  floorsConfig: tmpFloors === undefined ? undefined : tmpFloors.data,
  searchAddresses,
  searchNames,
}
