/* eslint-disable functional/functional-parameters */
import { type Info, type SvgMapViewerConfigUser } from 'svgmapviewer'
import type { SearchAddress } from 'svgmapviewer/address'

import { addresses } from './address'
import { addressStringNameMap } from './names'
import { RenderInfo as renderInfo } from './render'

async function getSearchEntries(): Promise<readonly SearchAddress[]> {
  return addresses.map(([address, floorPos]) => ({
    address,
    floorPos,
  }))
}

async function getSearchInfo(a: Readonly<SearchAddress>): Promise<null | Info> {
  const names = addressStringNameMap.get(a.address)
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
