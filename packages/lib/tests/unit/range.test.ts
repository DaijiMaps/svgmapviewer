import { expect, test } from 'vitest'
import { type BoxBox } from '../../src/lib/box/prefixed'
import { makeRanges, printRanges, within } from '../../src/lib/range'
import { type VecVec } from '../../src/lib/vec/prefixed'

interface Ranges {
  o: VecVec
  u: VecVec
  n: VecVec
}

test('unit', () => {
  const b1: BoxBox = { x: 0, y: 0, width: 1, height: 1 }
  const n1: VecVec = { x: 1, y: 1 }
  const r1: Ranges = makeRanges(b1, n1)
  expect(r1).toStrictEqual({
    o: { x: 0, y: 0 },
    u: { x: 1, y: 1 },
    n: { x: 1, y: 1 },
  })
})

test('10', () => {
  const b1: BoxBox = { x: 0, y: 0, width: 10, height: 10 }
  const n1: VecVec = { x: 5, y: 5 }
  const r1: Ranges = makeRanges(b1, n1)
  expect(r1).toStrictEqual({
    o: { x: 0, y: 0 },
    u: { x: 2, y: 2 },
    n: { x: 5, y: 5 },
  })
})

test('print', () => {
  const r = {
    o: { x: 0, y: 0 },
    u: { x: 1, y: 1 },
    n: { x: 3, y: 3 },
  }
  printRanges(r)
})

test('within', () => {
  const n = 4
  const o = 1
  const u = 2
  const ps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const xs = [null, 0, 0, 1, 1, 2, 2, 3, 3, null, null]
  const res = ps.map((p) => within(o, u, n, p))
  expect(res).toStrictEqual(xs)
})
