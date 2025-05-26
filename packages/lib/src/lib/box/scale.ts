import { matrixScale, matrixScaleAt } from '../matrix/prefixed'
import { type V } from '../tuple'
import { type VecVec } from '../vec/prefixed'
import { type Box } from './main'
import { transform } from './transform'

//// scale
//// scaleAt
//// scaleAtRatio
//// scaleAtCenter
//// scaleAtOff

export const scale = (b: Box, s: number | V | VecVec): Box =>
  transform(b, matrixScale(toV(s)))

export const scaleAt = (
  b: Box,
  s: number | V | VecVec,
  cx: number,
  cy: number
): Box => transform(b, matrixScaleAt(toV(s), [cx, cy]))

export const scaleAtRatio = (
  b: Box,
  s: number | V | VecVec,
  rx: number,
  ry: number
): Box => scaleAt(b, toV(s), b.x + b.width * rx, b.y + b.height * ry)

export const scaleAtCenter = (b: Box, s: number | V | VecVec): Box =>
  scaleAtRatio(b, s, 0.5, 0.5)

export const scaleAtOff = (
  b: Box,
  s: number | V | VecVec,
  dx: number,
  dy: number
): Box => scaleAt(b, s, b.x + b.width * 0.5 + dx, b.y + b.height * 0.5 + dy)

function toV(s: number | V | VecVec): V {
  return typeof s === 'number' ? [s, s] : !('x' in s) ? s : [s.x, s.y]
}
