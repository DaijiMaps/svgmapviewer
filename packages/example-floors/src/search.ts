/* eslint-disable functional/functional-parameters */
import { type Info, type POI, type SvgMapViewerConfigUser } from 'svgmapviewer'
import { type SearchEntries, type SearchPos } from 'svgmapviewer/search'
import { pois } from './data'
import { RenderInfo as renderInfo } from './render'

function nameToArray(name: string | readonly string[]): readonly string[] {
  return typeof name === 'string' ? [name] : name
}

const addresses: SearchEntries = pois.map((poi) => ({
  address: nameToArray(poi.name).join(' '),
  coord: poi.pos,
  fidx: poi.fidx,
}))
const addressMap = new Map<string, POI>(
  pois.map((poi) => [nameToArray(poi.name).join(' '), poi])
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
