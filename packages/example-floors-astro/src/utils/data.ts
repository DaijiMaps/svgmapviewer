import { getCollection as c, getEntry as e } from 'astro:content'
import type { SvgMapViewerConfigUser } from 'svgmapviewer'

import {
  entryToAddress,
  entryToInfo,
  entryToLabelEntry,
  entryToName,
} from './content'

const all = await e('svgMapViewerConfig', 'default')?.then((x) => x?.data)
const floors = await e('floors', 'default')?.then((x) => x?.data)
const labels = await c('labels')?.then((a) => a.map(entryToLabelEntry))
const searchAddresses = await c('addresses').then((a) => a.map(entryToAddress))
const searchNames = await c('names').then((a) => a.map(entryToName))
const searchInfos = await c('pois').then((a) => a.map(entryToInfo))

const floorsConfig = floors && {
  ...floors,
  labelsMap: Object.fromEntries(labels),
}

export const svgMapViewerConfigUser: SvgMapViewerConfigUser = {
  ...all,
  floorsConfig,
  searchAddresses,
  searchNames,
  searchInfos,
}
