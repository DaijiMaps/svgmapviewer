/* eslint-disable functional/functional-parameters */
import { type Info, type POI, type SvgMapViewerConfigUser } from 'svgmapviewer'
import { type SearchEntries, type SearchPos } from 'svgmapviewer/search'
import { pois } from './data'
import { RenderInfo as renderInfo } from './render'

const addresses: SearchEntries = pois.map((poi) => ({
  address: poi.name.join(' '),
  coord: poi.pos,
  fidx: poi.fidx,
}))
const addressMap = new Map<string, POI>(
  pois.map((poi) => [poi.name.join(' '), poi])
)

function getSearchEntries(): SearchEntries {
  return addresses
}

function getSearchInfo(pos: Readonly<SearchPos>): null | Info {
  const poi = addressMap.get(pos.address)
  if (poi === undefined) {
    return null
  }
  return {
    title: pos.address,
    x: poi.x,
  }
}

export const searchConfig: SvgMapViewerConfigUser = {
  getSearchEntries,
  getSearchInfo,
  renderInfo,
}
