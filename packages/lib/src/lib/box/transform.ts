//// boxTransform

import { pipe } from 'fp-ts/function'
import { apply, type Matrix } from '../matrix'
import { mapF } from './main'
import { fromTlBr, tlBrFromB, tlBrToB, toTlBr } from './tlbr'
import type { Box } from './types'

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
