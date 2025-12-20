import { scaleAt } from '../matrix'
import { transform } from './transform'
import { type Box } from './types'

//// expandAt
//// expandAtRatio
//// expandAtCenter
//// expandAtOff

export function expandAt(b: Box, s: number, cx: number, cy: number): Box {
  const r = transform(b, scaleAt([s, s], [cx, cy]))
  return {
    x: -r.x,
    y: -r.y,
    width: b.width,
    height: b.height,
  }
}

export function expandAtRatio(b: Box, s: number, rx: number, ry: number): Box {
  return expandAt(b, s, b.x + b.width * rx, b.y + b.height * ry)
}

export function expandAtCenter(b: Box, s: number): Box {
  return expandAtRatio(b, s, 0.5, 0.5)
}

export function expandAtOff(b: Box, s: number, dx: number, dy: number): Box {
  return expandAt(b, s, b.x + b.width * 0.5 + dx, b.y + b.height * 0.5 + dy)
}
