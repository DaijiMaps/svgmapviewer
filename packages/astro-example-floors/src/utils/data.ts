import { getCollection, getEntry } from 'astro:content'
import type { Address } from 'svgmapviewer/address'

export const addresses: readonly Address[] = await getCollection(
  'addresses'
).then((xs) => {
  return xs.map(({ id, data }) => [id, data] as const)
})

const tmpConfig = await getEntry('svgMapViewerConfig', 'default')

export const config = tmpConfig === undefined ? {} : tmpConfig.data
