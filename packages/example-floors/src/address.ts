import { type Pos } from 'svgmapviewer/address'

import { addresses } from './data/floors-addresses'

export { addresses }

export const addressMap = new Map<string, Pos>(addresses)
