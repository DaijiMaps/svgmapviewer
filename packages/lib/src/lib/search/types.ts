import type Flatbush from 'flatbush'

import { type Addr, type Pos } from '../address'

export type Idx = string

export interface SearchPos {
  address: Addr
  pos: Pos
}

////

export type FlatbushIndexes = Record<Idx, SearchPos>

export interface SearchContext {
  fb: Flatbush
  idxs: FlatbushIndexes
}
