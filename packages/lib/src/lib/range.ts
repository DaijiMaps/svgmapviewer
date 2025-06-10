/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-return-void */
import { type BoxBox } from '../../src/lib/box/prefixed'
import { vecDiv, type VecVec } from '../../src/lib/vec/prefixed'

type Index = number // int
type IVecVec = { x: Index; y: Index }

export interface Ranges {
  o: VecVec
  u: VecVec
  n: VecVec
}

export interface Match {
  s: IVecVec
  e: IVecVec
}

////

export function makeRanges(b: BoxBox, n: VecVec): Ranges {
  const o: VecVec = { x: b.x, y: b.y }
  const z: VecVec = { x: b.width, y: b.height }
  const u: VecVec = vecDiv(z, n)
  return { o, u, n }
}

export function printRanges(r: Readonly<Ranges>): void {
  for (let i = 0; i < r.n.x; i++) {
    for (let j = 0; j < r.n.y; j++) {
      console.log(i, j)
    }
  }
}

export function within(
  o: number,
  u: number,
  n: number,
  p: number
): null | Index {
  const d = p - o
  if (d < 0 || d >= u * n) {
    return null
  } else {
    return Math.floor(d / u)
  }
}

export function matchPoint(r: Readonly<Ranges>, p: VecVec): null | IVecVec {
  const x: null | Index = within(r.o.x, r.u.x, r.n.x, p.x)
  if (x === null) {
    return null
  }
  const y: null | Index = within(r.o.y, r.u.y, r.n.y, p.y)
  if (y === null) {
    return null
  }
  return { x, y }
}

export function matchBox(r: Readonly<Ranges>, b: BoxBox): null | Match {
  const s: null | IVecVec = matchPoint(r, { x: b.x, y: b.y })
  if (s === null) {
    return null
  }
  const e: null | IVecVec = matchPoint(r, {
    x: b.x + b.width,
    y: b.y + b.height,
  })
  if (e === null) {
    return null
  }
  return { s, e }
}
