import { type Pos, addressesJsonToAddresses } from 'svgmapviewer/address'

import addressesJson_0 from './data/addresses-1F.json' with { type: 'json' }
import addressesJson_1 from './data/addresses-2F.json' with { type: 'json' }

export const addresses = [
  ...addressesJsonToAddresses(addressesJson_0, 0),
  ...addressesJsonToAddresses(addressesJson_1, 1),
]

export const addressMap = new Map<string, Pos>(addresses)
