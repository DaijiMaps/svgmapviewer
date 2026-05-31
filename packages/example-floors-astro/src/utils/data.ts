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

////

const tmpConfig = await e('svgMapViewerConfig', 'default')
const tmpFloors = await e('floors', 'default')
const searchAddresses = await c('addresses').then((a) => a.map(toAddress))
const searchNames = await c('names').then((a) => a.map(toName))
const searchInfos = await c('pois').then((a) => a.map(toInfo))

export const svgMapViewerConfigUser: SvgMapViewerConfigUser = {
  ...tmpConfig?.data,
  floorsConfig: tmpFloors?.data,
  searchAddresses,
  searchNames,
  searchInfos,
}
