import { type Address, type AddressesJson } from './types'

export function addressesJsonToAddresses(
  json: AddressesJson,
  fidx: number
): readonly Address[] {
  return Object.entries(json).map(([astr, pos]) => [astr, { pos, fidx }])
}

export function addressesJsonsToAddresses(
  jsons: readonly AddressesJson[]
): readonly Address[] {
  return jsons.flatMap((json, idx) => addressesJsonToAddresses(json, idx))
}
