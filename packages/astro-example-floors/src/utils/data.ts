import { getCollection, getEntry } from 'astro:content'
import type { Address, NameEntry } from 'svgmapviewer/address'

const searchAddresses: readonly Address[] = await getCollection(
  'addresses'
).then((xs) => {
  return xs.map(({ id, data }) => [id, data] as const)
})

const searchNames: readonly NameEntry[] = []

const tmpConfig = await getEntry('svgMapViewerConfig', 'default')

export const config = {
  ...(tmpConfig === undefined ? {} : tmpConfig.data),
  searchAddresses,
  searchNames,
}
