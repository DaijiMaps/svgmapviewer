import { namesToNameMap, namesToRNameMap } from 'svgmapviewer/address'

import { names } from './data/floors-names'

export const nameAddressStringMap = namesToNameMap(names)
export const addressStringNameMap = namesToRNameMap(names)
