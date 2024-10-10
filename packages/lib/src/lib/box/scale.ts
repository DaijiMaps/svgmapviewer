import { V } from '../matrix'
import { matrixScale, matrixScaleAt } from '../matrix/prefixed'
import { Box } from './main'
import { transform } from './transform'

//// scale
//// scaleAt
//// scaleAtRatio
//// scaleAtCenter
//// scaleAtOff

export const scale = (b: Box, s: number | V): Box =>
  transform(b, matrixScale(toV(s)))

export const scaleAt = (b: Box, s: number | V, cx: number, cy: number): Box =>
  transform(b, matrixScaleAt(toV(s), [cx, cy]))

export const scaleAtRatio = (
  b: Box,
  s: number | V,
  rx: number,
  ry: number
): Box => scaleAt(b, toV(s), b.x + b.width * rx, b.y + b.height * ry)

export const scaleAtCenter = (b: Box, s: number | V): Box =>
  scaleAtRatio(b, s, 0.5, 0.5)

export const scaleAtOff = (
  b: Box,
  s: number | V,
  dx: number,
  dy: number
): Box => scaleAt(b, s, b.x + b.width * 0.5 + dx, b.y + b.height * 0.5 + dy)

function toV(s: number | V): V {
  return typeof s === 'number' ? [s, s] : s
}
