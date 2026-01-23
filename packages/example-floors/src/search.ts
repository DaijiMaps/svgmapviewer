/* eslint-disable functional/functional-parameters */
import { type Info, type POI, type SvgMapViewerConfigUser } from 'svgmapviewer'
import { type SearchPos } from 'svgmapviewer/search'

import { pois } from './data/pois'
import { RenderInfo as renderInfo } from './render'

type Name = POI['name']

// XXX
// XXX
// XXX
function nameToString(name: Name): string {
  return (typeof name === 'string' ? [name] : name).join(' ')
}
// XXX
// XXX
// XXX

const addresses = pois.map((poi) => ({
  address: nameToString(poi.name),
  coord: poi.coord,
  fidx: poi.fidx ?? 0,
}))
const addressMap = new Map<string, POI>(
  pois.map((poi) => [nameToString(poi.name), poi])
)

function getSearchEntries() {
  return addresses
}

function getSearchInfo(coord: Readonly<SearchPos>): null | Info {
  const poi = addressMap.get(coord.address)
  if (poi === undefined) {
    return null
  }
  return {
    title: coord.address,
    x: poi.x,
  }
}

export const searchConfig: SvgMapViewerConfigUser = {
  getSearchEntries,
  getSearchInfo,
  renderInfo,
}
