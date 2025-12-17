import type Flatbush from 'flatbush'
import { type VecVec } from '../vec/prefixed'

export type Address = string
export type Idx = string

export type FlatbushIndexes = Record<Idx, AddressEntry>

export interface AddressEntry {
  address: Address
  coord: VecVec
  fidx?: number
}
export type AddressEntries = readonly AddressEntry[]

export interface SearchContext {
  fb: Flatbush
  idxs: FlatbushIndexes
}

export interface SearchAddressRes {
  address: Address
  coord: VecVec
}
