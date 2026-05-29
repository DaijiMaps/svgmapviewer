import type Flatbush from 'flatbush'

import { type Addr, type FloorPos } from '../address'

export type Idx = string

export interface SearchPos {
  readonly address: Addr
  readonly pos: FloorPos
}

////

export type FlatbushIndexes = Record<Idx, SearchPos>

export interface SearchContext {
  readonly fb: Flatbush
  readonly idxs: FlatbushIndexes
}
