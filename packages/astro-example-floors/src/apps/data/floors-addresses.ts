//import { getCollection } from 'astro:content'
import { addressesJsonToAddresses, type Address } from 'svgmapviewer/address'

import addressesJson_0 from './addresses-1F.json' with { type: 'json' }
import addressesJson_1 from './addresses-2F.json' with { type: 'json' }
//import { getCollection } from 'astro:content'

export const addresses: Promise<readonly Address[]> = Promise.resolve([
  ...addressesJsonToAddresses(addressesJson_0, 0),
  ...addressesJsonToAddresses(addressesJson_1, 1),
])

/*
export const addresses: Promise<readonly Address[]> = getCollection(
  'addresses'
).then((xs) => {
  return xs.map(({ id, data }) => [id, data] as const)
})
*/
