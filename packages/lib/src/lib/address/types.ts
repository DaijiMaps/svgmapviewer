import { type VecVec } from '../vec/prefixed'

//// names json

export type Addr = string
export type Name = string

export type Addrs = readonly Addr[]

export type AddrSet = Set<Addr>

export type NamesJson = Record<Name, Addrs>

export type NameEntry = readonly [Name, Addrs]
export type Names = readonly NameEntry[]
export type NameMap = Map<Name, AddrSet>

export type FlatEntry = readonly [Name, Addr]
export type FlatEntries = readonly FlatEntry[]

//// addresses json

export type Coord = VecVec
export type FloorIdx = number
export type Pos = Readonly<{ readonly coord: Coord; readonly fidx: FloorIdx }>

export type AddressesJson = Record<Addr, Coord>
export type AddressesJsons = readonly AddressesJson[]

export type Address = readonly [string, Pos]
export type Addresses = readonly Address[]
export type AddressMap = Map<Addr, Pos>
