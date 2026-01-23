/* eslint-disable functional/functional-parameters */
import { type Info, type SvgMapViewerConfigUser } from 'svgmapviewer'
import { type SearchPos } from 'svgmapviewer/search'

import { addresses } from './address'
import { addressStringNameMap } from './names'
import { RenderInfo as renderInfo } from './render'

function getSearchEntries() {
  return addresses.map(([address, { pos, fidx }]) => ({
    address,
    coord: pos,
    fidx: fidx ?? 0,
  }))
}

function getSearchInfo(pos: Readonly<SearchPos>): null | Info {
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
  getSearchEntries,
  getSearchInfo,
  renderInfo,
}
