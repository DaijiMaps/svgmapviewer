import {
  getCollection as c,
  getEntry as e,
  type CollectionEntry,
} from 'astro:content'
import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import type {
  SearchAddress,
  SearchInfo,
  SearchName,
} from 'svgmapviewer/address'

const toAddress = (
  x: Readonly<CollectionEntry<'addresses'>>
): SearchAddress => ({
  address: x.id,
  floorPos: x.data,
})
const toName = (x: Readonly<CollectionEntry<'names'>>): SearchName => ({
  name: x.id,
  addresses: x.data,
})
const toInfo = (x: Readonly<CollectionEntry<'pois'>>): SearchInfo => ({
  name: x.id,
  info: { title: x.id, x: x.data },
})

const svgMapViewerConfig = await e('svgMapViewerConfig', 'default')?.then(
  (x) => x?.data
)
const floorsConfig = await e('floors', 'default')?.then((x) => x?.data)
const searchAddresses = await c('addresses').then((a) => a.map(toAddress))
const searchNames = await c('names').then((a) => a.map(toName))
const searchInfos = await c('pois').then((a) => a.map(toInfo))

export const svgMapViewerConfigUser: SvgMapViewerConfigUser = {
  ...svgMapViewerConfig,
  floorsConfig,
  searchAddresses,
  searchNames,
  searchInfos,
}
