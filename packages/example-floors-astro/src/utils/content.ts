import { type CollectionEntry } from 'astro:content'
import type {
  SearchAddress,
  SearchInfo,
  SearchName,
} from 'svgmapviewer/address'

export const entryToAddress = (
  x: Readonly<CollectionEntry<'addresses'>>
): SearchAddress => ({
  address: x.id,
  floorPos: x.data,
})

export const entryToName = (
  x: Readonly<CollectionEntry<'names'>>
): SearchName => ({
  name: x.id,
  addresses: x.data,
})

export const entryToInfo = (
  x: Readonly<CollectionEntry<'pois'>>
): SearchInfo => ({
  name: x.id,
  info: { title: x.id, x: x.data },
})
