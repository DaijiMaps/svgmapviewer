import { type BoxBox as Box } from '../box/prefixed'
import { type V } from '../tuple'

function fitH(o: Box, r: number): V {
  return [0, (o.height - o.width / r) / 2]
}

function fitV(o: Box, r: number): V {
  return [(o.width - o.height * r) / 2, 0]
}

export function fit(
  o: Box,
  i: Box
): readonly [readonly [x: number, y: number], s: number] {
  const R = o.width / o.height
  const r = i.width / i.height
  const [x, y] = R > r ? fitV(o, r) : fitH(o, r)
  const s = R > r ? i.height / o.height : i.width / o.width
  return [[x, y], s]
}
