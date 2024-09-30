import { expect, test } from 'vitest'
import { arrayDelete, isNotNull, isNull } from './utils'

test('isNull', () => {
  expect(isNull(null)).toBe(true)
  expect(isNull(0)).toBe(false)
  expect(isNotNull(null)).toBe(false)
  expect(isNotNull(0)).toBe(true)
})

test('arrayDelete', () => {
  const cb1 = () => {}
  const cb2 = () => {}
  const cb3 = () => {}
  const a = [cb1, cb2, cb3]
  const b = arrayDelete(a, cb2)
  expect(b.length).toBe(2)
  expect(b[0]).toBe(cb1)
  expect(b[1]).toBe(cb3)
})
