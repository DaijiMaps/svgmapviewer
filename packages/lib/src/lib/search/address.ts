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
    address,
    coord: { x, y },
    fidx,
  } of entries) {
    const idx = fb.add(x, y)
    idxs[`${idx}`] = { address, coord: { x, y }, fidx }
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
  return { b }
}

// XXX
// XXX
// XXX
const MAX_DISTANCE = 100
// XXX
// XXX
// XXX

export function searchAddress(
  { b }: SearchContext,
  pgeo: Vec,
  fidx: number
): SearchAddressRes | null {
  const { fb, idxs } = b

  const filter = (idx: number) => {
    const e = idxs[`${idx}`]
    return e.fidx === undefined || e.fidx === fidx
  }

  const ns = fb.neighbors(pgeo.x, pgeo.y, 1, MAX_DISTANCE, filter)
  if (ns.length === 0) {
    return null
  }
  const n = ns[0]
  const e = idxs[`${n}`]
  if (e === undefined) {
    return null
  }
  return e
}
