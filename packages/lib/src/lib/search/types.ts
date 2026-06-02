import type Flatbush from 'flatbush'

import { type SearchAddress } from '../address'

export type Idx = string

////

export type FlatbushIndexes = Record<Idx, SearchAddress>

export interface SearchContext {
  readonly fb: Flatbush
  readonly idxs: FlatbushIndexes
}
