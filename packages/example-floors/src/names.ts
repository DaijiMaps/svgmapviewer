import {
  namesJsonToNames,
  namesToNameMap,
  namesToRNameMap,
} from 'svgmapviewer/address'

import namesJson from './data/names.json' with { type: 'json' }

const names = namesJsonToNames(namesJson)

export const nameAddressStringMap = namesToNameMap(names)
export const addressStringNameMap = namesToRNameMap(names)
