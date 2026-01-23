import { expect, test } from '@rstest/core'

import {
  entriesToMap,
  namesToEntries,
  namesToREntries,
  type NameMap,
  type Names,
} from '../../src/lib/address'

/*
type Addr = string
type Name = string

type Addrs = readonly string[]

type AddrSet = Set<Addr>

type Names = readonly [Name, Addrs][]
type NameMap = Map<string, AddrSet>

type Entries = readonly [string, string][]

function namesToEntries(names: Names): Entries {
  return names.flatMap(([k, vs]) => vs.map((v) => [k, v]))
}

function namesToREntries(names: Names): Entries {
  return names.flatMap(([k, vs]) => vs.map((v) => [v, k]))
}

function entriesToMap(entries: readonly [string, string][]): NameMap {
  function f1(m1, [k, v]) {
    const s = m1.get(k) ?? new Set()
    const s1 = new Set([...s, v])
    return new Map([...m1, [k, s1]])
  }

  return entries.reduce(f1, new Map())
}

function namesToMap(names: Names): NameMap {
  return entriesToMap(namesToEntries(names))
}

function namesToRMap(names: Names): NameMap {
  return entriesToMap(namesToREntries(names))
}
*/

test('entries', () => {
  const o = {
    A: ['a1', 'a2'],
    B: ['b1'],
  }
  const exp = [
    ['A', 'a1'],
    ['A', 'a2'],
    ['B', 'b1'],
  ]
  const res = namesToEntries(Object.entries(o))
  expect(res).toEqual(exp)
})

test('map', () => {
  const a: Names = [
    ['A', ['c']],
    ['B', ['c', 'd']],
  ]
  const b: NameMap = new Map([
    ['A', new Set(['c'])],
    ['B', new Set(['c', 'd'])],
  ])

  const m = entriesToMap(namesToEntries(a))

  expect(m).toEqual(b)
})

test('reverse map', () => {
  const a: Names = [
    ['A', ['c']],
    ['B', ['c', 'd']],
  ]
  const b: NameMap = new Map([
    ['c', new Set(['A', 'B'])],
    ['d', new Set(['B'])],
  ])

  const m = entriesToMap(namesToREntries(a))

  expect(m).toEqual(b)
})
