import type Flatbush from 'flatbush'
import { type VecVec } from '../vec/prefixed'

export type Address = string
export type Idx = string

// XXX Idx -> AddressEntry
export type FlatbushIndexes = Record<Idx, AddressEntry>

export interface AddressBuf {
  fb: Flatbush
  idxs: FlatbushIndexes
}

export interface AddressEntry {
  address: Address
  coord: VecVec
  fidx?: number
}
export type AddressEntries = readonly AddressEntry[]

export interface SearchContext {
  buf: AddressBuf
}

export interface SearchAddressRes {
  address: Address
  coord: VecVec
}
