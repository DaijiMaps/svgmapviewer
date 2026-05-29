import { getCollection, getEntry } from 'astro:content'
import type { SearchAddress, SearchName } from 'svgmapviewer/address'

const searchAddresses: readonly SearchAddress[] = await getCollection(
  'addresses'
).then((xs) => xs.map(({ id, data }) => ({ address: id, floorPos: data })))

const searchNames: readonly SearchName[] = await getCollection('names').then(
  (xs) => xs.map(({ id, data }) => ({ name: id, addresses: data }))
)

const tmpConfig = await getEntry('svgMapViewerConfig', 'default')

export const config = {
  ...(tmpConfig === undefined ? {} : tmpConfig.data),
  searchAddresses,
  searchNames,
}
