export type Addr = string
export type Name = string

export type Addrs = readonly string[]

export type AddrSet = Set<Addr>

export type Names = readonly [Name, Addrs][]
export type NameMap = Map<string, AddrSet>

export type Entry = readonly [string, string]
export type Entries = readonly Entry[]

function expandEntries([k, vs]: Readonly<Names[0]>): Entries {
  return vs.map((v) => [k, v] as Entry) as Entries
}

export function namesToEntries(names: Names): Entries {
  return Array.from(names).flatMap(expandEntries)
}

export function namesToREntries(names: Names): Entries {
  return Array.from(names)
    .flatMap(expandEntries)
    .map(([k, v]) => [v, k])
}

export function entriesToMap(entries: Entries): NameMap {
  function f1(m1: NameMap, [k, v]: Entry) {
    const s = m1.get(k) ?? new Set()
    const s1 = new Set([...s, v])
    return new Map([...m1, [k, s1]])
  }

  return entries.reduce(f1, new Map())
}

/*
function namesToMap(names: Names): NameMap {
  return entriesToMap(namesToEntries(names))
}

function namesToRMap(names: Names): NameMap {
  return entriesToMap(namesToREntries(names))
}
*/
