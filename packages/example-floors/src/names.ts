import {
  namesToNameMap,
  namesToRNameMap,
  type NameMap,
} from 'svgmapviewer/address'

import { names } from './data/floors-names'

export const nameAddressStringMap: NameMap = namesToNameMap(names)
export const addressStringNameMap: NameMap = namesToRNameMap(names)
