/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import Flatbush from 'flatbush'

import type { SearchGeoReq } from '../../types'

import {
  type FlatbushIndexes,
  type SearchContext,
  type SearchPos,
} from './types'

export function initAddresses(entries: Readonly<SearchPos[]>): SearchContext {
  const fb: Flatbush = new Flatbush(entries.length)
  const idxs: FlatbushIndexes = {}
  for (const e of entries) {
    const { x, y } = e.coord
    const idx = fb.add(x, y)
    idxs[idx] = e
  }
  fb.finish()
  return {
    fb,
    idxs,
  }
}

// XXX
// XXX
// XXX
const MAX_DISTANCE = 100
// XXX
// XXX
// XXX

// XXX async?
export function searchAddress(
  { fb, idxs }: SearchContext,
  { pgeo, fidx }: Readonly<SearchGeoReq>
): SearchPos | null {
  const filter = (idx: number) => {
    const e = idxs[idx]
    return e.fidx === undefined || e.fidx === fidx
  }
  const ns = fb.neighbors(pgeo.x, pgeo.y, 1, MAX_DISTANCE, filter)
  if (ns.length === 0) {
    return null
  }
  const n = ns[0]
  const e = idxs[n]
  if (e === undefined) {
    return null
  }
  return e
}
