///* eslint-disable functional/functional-parameters */
import { type Info, type SvgMapViewerConfigUser } from 'svgmapviewer'
//import type { Address } from 'svgmapviewer/address'
import { type SearchPos } from 'svgmapviewer/search'

//import { addresses } from './address'
import { addressStringNameMap } from './names'
import { RenderInfo as renderInfo } from './render'

/*
function addressToSearchPos([address, pos]: Address): SearchPos {
  return { address, pos }
}

async function getSearchEntries(): Promise<readonly SearchPos[]> {
  return addresses
    .then((xs) => xs.map(addressToSearchPos))
    .catch((e) => {
      throw new Error(`addresses`, e)
    })
}
*/

async function getSearchInfo(pos: Readonly<SearchPos>): Promise<null | Info> {
  const names = addressStringNameMap.get(pos.address)
  if (names === undefined || names.size < 1) {
    return null
  }
  const name = Array.from(names)[0]
  return {
    title: name,
    x: {
      tag: 'unknown',
    },
  }
}

export const searchConfig: SvgMapViewerConfigUser = {
  //getSearchEntries,
  getSearchInfo,
  renderInfo,
}
