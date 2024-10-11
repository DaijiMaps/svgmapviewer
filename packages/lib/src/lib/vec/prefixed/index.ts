import { add, addF } from '../add'
import { angle, angleF } from '../angle'
import { copy } from '../copy'
import { dist, qdist } from '../dist'
import { div, divF } from '../div'
import { compare, ord } from '../fp-ts'
import { interpolate, interpolateF } from '../interpolate'
import { fromV, one, toV, vec, Vec, Vecs, zero } from '../main'
import { midpoint } from '../midpoint'
import { min, minF } from '../min'
import { mul, mulF } from '../mul'
import { scale, scaleF } from '../scale'
import { sub, subF } from '../sub'
import { sum } from '../sum'

export type { Vec as VecVec, Vecs as VecVecs }

export {
  add as vecAdd,
  addF as vecAddF,
  angle as vecAngle,
  angleF as vecAngleF,
  compare as vecCompare,
  copy as vecCopy,
  dist as vecDist,
  div as vecDiv,
  divF as vecDivF,
  fromV as vecFromV,
  interpolate as vecInterpolate,
  interpolateF as vecInterpolateF,
  midpoint as vecMidpoint,
  min as vecMin,
  minF as vecMinF,
  mul as vecMul,
  mulF as vecMulF,
  one as vecOne,
  ord as vecOrd,
  qdist as vecQdist,
  scale as vecScale,
  scaleF as vecScaleF,
  sub as vecSub,
  subF as vecSubF,
  sum as vecSum,
  toV as vecToV,
  vec as vecVec,
  zero as vecZero,
}
