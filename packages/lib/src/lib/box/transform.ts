//// boxTransform

import { pipe } from 'fp-ts/function'

import type { Box } from './types'

import { apply, type Matrix } from '../matrix'
import { mapF } from './main'
import { fromTlBr, tlBrFromB, tlBrToB, toTlBr } from './tlbr'
import { vecDiv, vecSub, vecVec } from '../vec/prefixed'

export function transform(b: Box, m: Matrix): Box {
  return pipe(
    b,
    toTlBr,
    tlBrToB,
    (b) => mapF(b, (v) => apply(m, v, 1)),
    tlBrFromB,
    fromTlBr
  )
}

export function toToransform(a: Box, b: Box): DOMMatrixReadOnly {
  const { x: ra, y: rd } = vecDiv(
    vecVec(b.width, b.height),
    vecVec(a.width, a.height)
  )
  const { x: re, y: rf } = vecSub(b, a)
  return new DOMMatrixReadOnly([ra, 0, 0, rd, re, rf])
}
