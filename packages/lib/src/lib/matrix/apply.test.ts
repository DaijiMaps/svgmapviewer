import { expect, test } from 'vitest'
import { type V } from '../tuple'
import { apply } from './apply'
import { type Matrix } from './main'

const m: Matrix = [
  [2, 0],
  [0, 2],
  [0, 0],
]
const p: V = [1, 1]

const q = apply(m, p, 1)

test('apply', () => {
  expect(q).toStrictEqual([2, 2])
})
