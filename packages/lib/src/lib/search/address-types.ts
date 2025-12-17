import type Flatbush from 'flatbush'
import { type VecVec } from '../vec/prefixed'

export type Address = string
export type Idx = string

export interface SearchAddress {
  address: Address
  coord: VecVec
  fidx?: number
}
export type AddressEntries = readonly SearchAddress[]

////

export type FlatbushIndexes = Record<Idx, SearchAddress>

export interface SearchContext {
  fb: Flatbush
  idxs: FlatbushIndexes
}
