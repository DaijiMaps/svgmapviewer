import {
  type FlatEntries,
  type NameMap,
  type Names,
  type NamesJson,
  type FlatEntry,
} from './types'

export function namesJsonToNames(json: NamesJson): Names {
  return Object.entries(json)
}

function expandEntries([k, vs]: Readonly<Names[0]>): FlatEntries {
  return vs.map((v) => [k, v] as FlatEntry) as FlatEntries
}

export function namesToEntries(names: Names): FlatEntries {
  return Array.from(names).flatMap(expandEntries)
}

export function namesToREntries(names: Names): FlatEntries {
  return Array.from(names)
    .flatMap(expandEntries)
    .map(([k, v]) => [v, k])
}

export function entriesToMap(entries: FlatEntries): NameMap {
  function f1(m1: NameMap, [k, v]: FlatEntry) {
    const s = m1.get(k) ?? new Set()
    const s1 = new Set([...s, v])
    return new Map([...m1, [k, s1]])
  }

  return entries.reduce(f1, new Map())
}

export function namesToNameMap(names: Names): NameMap {
  return entriesToMap(namesToEntries(names))
}

export function namesToRNameMap(names: Names): NameMap {
  return entriesToMap(namesToREntries(names))
}
