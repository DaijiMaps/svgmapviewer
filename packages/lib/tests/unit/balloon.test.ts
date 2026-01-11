import { expect, test } from '@rstest/core'
import { layoutLeg } from '../../src/lib/ui/balloon-common'
import { type HV } from '../../src/types'
import {
  vecVec as v,
  vecAdd,
  type VecVec as V,
} from '../../src/lib/vec/prefixed'

type P1 = {
  hv: HV
  res: {
    a: V
    b: V
    q: V
  }
}

type P2 = {
  hv: HV
  da: V
  db: V
  dq: V
}

const BW = 40
const BH = 40
const LL = 4

//// horizontal / vertical

const props1: { [key in string]: P1 } = {
  'balloon down': {
    hv: { h: 0, v: 1, th: 0 },
    res: {
      a: v(-1, -20),
      b: v(1, -20),
      q: v(0, -24),
    },
  },
  'balloon up': {
    hv: { h: 0, v: -1, th: 0 },
    res: {
      a: v(-1, 20),
      b: v(1, 20),
      q: v(0, 24),
    },
  },
  'balloon right': {
    hv: { h: 1, v: 0, th: 0 },
    res: {
      a: v(-20, -1),
      b: v(-20, 1),
      q: v(-24, 0),
    },
  },
  'balloon left': {
    hv: { h: -1, v: 0, th: 0 },
    res: {
      a: v(20, -1),
      b: v(20, 1),
      q: v(24, 0),
    },
  },
}

Object.entries(props1).forEach(([t, { hv, res }]) => {
  test(t, () => {
    const { a, b, q } = layoutLeg(hv, BW, BH, LL)
    expect({ a, b, q }).toStrictEqual({
      a: res.a,
      b: res.b,
      q: v(expect.closeTo(res.q.x), expect.closeTo(res.q.y)),
    })
  })
})

//// angled

const P = v(-20, -20)

const props2: { [key in string]: P2 } = {
  'balloon right/down (landscape)': {
    hv: { h: 1, v: 1, th: Math.PI / 6 },
    da: v(0, 0),
    db: v(0, 2),
    dq: v(-4, 0),
  },
  'balloon right/down (portrait)': {
    hv: { h: 1, v: 1, th: Math.PI / 3 },
    da: v(0, 0),
    db: v(2, 0),
    dq: v(0, -4),
  },
}

Object.entries(props2).forEach(([t, { hv, da, db, dq }]) => {
  test(t, () => {
    const { a, b, q } = layoutLeg(hv, BW, BH, LL)
    expect({ a, b, q }).toEqual({
      a: vecAdd(P, da),
      b: vecAdd(P, db),
      q: vecAdd(P, dq),
    })
  })
})
