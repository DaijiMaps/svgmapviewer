import { addressesJsonToAddresses } from 'svgmapviewer/address'

import addressesJson_0 from './addresses-1F.json' with { type: 'json' }
import addressesJson_1 from './addresses-2F.json' with { type: 'json' }

export const addresses = [
  ...addressesJsonToAddresses(addressesJson_0, 0),
  ...addressesJsonToAddresses(addressesJson_1, 1),
]
