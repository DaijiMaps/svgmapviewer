import type Flatbush from 'flatbush'
import { type VecVec } from '../vec/prefixed'

export type Address = string
export type Idx = string

export type FlatbushIndexes = Record<Idx, Address>

export interface AddressBuf {
  fb: Flatbush
  idxs: FlatbushIndexes
}

export type AddressEntry = { a: Address; coord: VecVec }
export type AddressEntries = readonly AddressEntry[]

export interface SearchContext {
  b: AddressBuf
  m: Map<Address, VecVec>
}

export interface SearchAddressRes {
  address: Address
  coord: VecVec
}
