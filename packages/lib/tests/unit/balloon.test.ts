import { expect, test } from '@rstest/core'
import { layoutLeg } from '../../src/lib/ui/balloon-common'
import { type HV } from '../../src/types'
import { vecVec } from '../../src/lib/vec/prefixed'

test('balloon down', () => {
  const hv: HV = { h: 0, v: 1, th: 0 }
  const bw = 40
  const bh = 40
  const ll = 4
  const { a, b, q } = layoutLeg(hv, bw, bh, ll)
  expect({ a, b, q }).toStrictEqual({
    a: vecVec(-1, -20),
    b: vecVec(1, -20),
    q: {
      x: expect.closeTo(0),
      y: -24,
    },
  })
})

test('balloon up', () => {
  const hv: HV = { h: 0, v: -1, th: 0 }
  const bw = 40
  const bh = 40
  const ll = 4
  const { a, b, q } = layoutLeg(hv, bw, bh, ll)
  expect({ a, b, q }).toStrictEqual({
    a: vecVec(-1, 20),
    b: vecVec(1, 20),
    q: {
      x: expect.closeTo(0),
      y: 24,
    },
  })
})

test('balloon right', () => {
  const hv: HV = { h: 1, v: 0, th: 0 }
  const bw = 40
  const bh = 40
  const ll = 4
  const { a, b, q } = layoutLeg(hv, bw, bh, ll)
  expect({ a, b, q }).toStrictEqual({
    a: vecVec(-20, -1),
    b: vecVec(-20, 1),
    q: {
      x: -24,
      y: expect.closeTo(0),
    },
  })
})

test('balloon left', () => {
  const hv: HV = { h: -1, v: 0, th: 0 }
  const bw = 40
  const bh = 40
  const ll = 4
  const { a, b, q } = layoutLeg(hv, bw, bh, ll)
  expect({ a, b, q }).toStrictEqual({
    a: vecVec(20, -1),
    b: vecVec(20, 1),
    q: {
      x: 24,
      y: expect.closeTo(0),
    },
  })
})

/*
test('balloon right/down', () => {
  const hv: HV = { h: 1, v: 1, th: 0 }
  const bw = 40
  const bh = 40
  const ll = 4
  const { a, b, q } = layoutLeg(hv, bw, bh, ll)
  expect({ a, b, q }).toStrictEqual({
    a: vecVec(-19, -20),
    b: vecVec(-20, -19),
    q: vecVec(-24, -24),
  })
})

test('balloon right/up', () => {
  const hv: HV = { h: 1, v: -1, th: 0 }
  const bw = 40
  const bh = 40
  const ll = 4
  const { a, b, q } = layoutLeg(hv, bw, bh, ll)
  expect({ a, b, q }).toStrictEqual({
    a: vecVec(-19, 20),
    b: vecVec(-20, 19),
    q: vecVec(-24, 24),
  })
})

test('balloon left/down', () => {
  const hv: HV = { h: -1, v: 1, th: 0 }
  const bw = 40
  const bh = 40
  const ll = 4
  const { a, b, q } = layoutLeg(hv, bw, bh, ll)
  expect({ a, b, q }).toStrictEqual({
    a: vecVec(19, -20),
    b: vecVec(20, -19),
    q: vecVec(24, -24),
  })
})

test('balloon left/up', () => {
  const hv: HV = { h: -1, v: -1, th: 0 }
  const bw = 40
  const bh = 40
  const ll = 4
  const { a, b, q } = layoutLeg(hv, bw, bh, ll)
  expect({ a, b, q }).toStrictEqual({
    a: vecVec(19, 20),
    b: vecVec(20, 19),
    q: vecVec(24, 24),
  })
})
*/
