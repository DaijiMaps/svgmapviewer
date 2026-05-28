import { type AddressMap, type Pos } from 'svgmapviewer/address'

import { addresses } from './data/floors-addresses'

export { addresses }

export const addressMap: AddressMap = new Map<string, Pos>(addresses)
