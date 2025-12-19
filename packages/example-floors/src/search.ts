/* eslint-disable functional/functional-parameters */
import { type Info, type POI, type SvgMapViewerConfigUser } from 'svgmapviewer'
import { type SearchEntries, type SearchPos } from 'svgmapviewer/search'
import { pois } from './data'
import { RenderInfo as renderInfo } from './render'

type Name = POI['name']

function nameToString(name: Name): string {
  return (typeof name === 'string' ? [name] : name).join(' ')
}

const addresses: SearchEntries = pois.map((poi) => ({
  address: nameToString(poi.name),
  coord: poi.pos,
  fidx: poi.fidx,
}))
const addressMap = new Map<string, POI>(
  pois.map((poi) => [nameToString(poi.name), poi])
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
