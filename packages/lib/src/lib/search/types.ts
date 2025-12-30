import type Flatbush from 'flatbush'
import { type VecVec } from '../vec/prefixed'

export type AddressString = string
export type Idx = string

export interface SearchPos {
  address: AddressString
  coord: VecVec
  fidx: number
}

////

export type FlatbushIndexes = Record<Idx, SearchPos>

export interface SearchContext {
  fb: Flatbush
  idxs: FlatbushIndexes
}
