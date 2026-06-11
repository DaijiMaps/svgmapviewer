import { getCollection as c, getEntry as e } from 'astro:content'
import type { SvgMapViewerConfigUser } from 'svgmapviewer'

import { entryToAddress, entryToInfo, entryToName } from './content'

const all = await e('svgMapViewerConfig', 'default')?.then((x) => x?.data)
const floorsConfig = await e('floors', 'default')?.then((x) => x?.data)
const searchAddresses = await c('addresses').then((a) => a.map(entryToAddress))
const searchNames = await c('names').then((a) => a.map(entryToName))
const searchInfos = await c('pois').then((a) => a.map(entryToInfo))

export const svgMapViewerConfigUser: SvgMapViewerConfigUser = {
  ...all,
  floorsConfig,
  searchAddresses,
  searchNames,
  searchInfos,
}
