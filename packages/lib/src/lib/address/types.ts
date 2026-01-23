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

export type Pos = Readonly<{ readonly x: number; readonly y: number }>
export type PosFidx = Readonly<{ readonly pos: Pos; readonly fidx: number }>

export type AddressesJson = Record<Addr, Pos>
export type AddressesJsons = readonly AddressesJson[]

export type Address = readonly [string, PosFidx]
export type Addresses = readonly Address[]
export type AddressMap = Map<Addr, PosFidx>
