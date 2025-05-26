import { type M, type V } from '../tuple'
import { multiply } from './multiply'
import { translate } from './translate'

export function scale([sx, sy]: V): M {
  return [
    [sx, 0],
    [0, sy],
    [0, 0],
  ]
}

export function scaleAt(s: V, c: V): M {
  const [cx, cy] = c
  return [translate(c), scale(s), translate([-cx, -cy])].reduce(multiply)
}
