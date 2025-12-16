/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import Flatbush from 'flatbush'
import { type VecVec as Vec } from '../vec/prefixed'
import {
  type AddressEntries,
  type FlatbushIndexes,
  type SearchAddressRes,
  type SearchContext,
} from './address-types'

function makeAddressBuf(entries: Readonly<AddressEntries>) {
  const l = entries.length
  const fb: Flatbush = new Flatbush(l)
  const idxs: FlatbushIndexes = {}
  for (const {
    a,
    coord: { x, y },
  } of entries) {
    const idx = fb.add(x, y)
    idxs[`${idx}`] = a
  }
  fb.finish()
  return {
    fb,
    idxs,
  }
}

export function initAddresses(
  entries: Readonly<AddressEntries>
): SearchContext {
  const b = makeAddressBuf(entries)
  const m = new Map(entries.map(({ a, coord }) => [a, coord]))
  return { b, m }
}

export function searchAddress(
  { b, m }: SearchContext,
  pgeo: Vec
): SearchAddressRes | null {
  const { fb, idxs } = b
  const ns = fb.neighbors(pgeo.x, pgeo.y, 1, 100)
  if (ns.length === 0) {
    return null
  }
  const n = ns[0]
  const address = idxs[`${n}`]
  const coord = m.get(address)
  if (coord === undefined) {
    return null
  }
  return { address, coord }
}
