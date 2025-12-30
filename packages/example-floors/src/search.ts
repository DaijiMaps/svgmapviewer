/* eslint-disable functional/functional-parameters */
import { type Info, type POI, type SvgMapViewerConfigUser } from 'svgmapviewer'
import { type SearchPos } from 'svgmapviewer/search'
import { pois } from './data'
import { RenderInfo as renderInfo } from './render'

type Name = POI['name']

function nameToString(name: Name): string {
  return (typeof name === 'string' ? [name] : name).join(' ')
}

const addresses = pois.map((poi) => ({
  address: nameToString(poi.name),
  coord: poi.pos,
  fidx: poi.fidx ?? 0,
}))
const addressMap = new Map<string, POI>(
  pois.map((poi) => [nameToString(poi.name), poi])
)

function getSearchEntries() {
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
