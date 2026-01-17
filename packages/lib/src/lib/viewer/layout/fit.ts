import { boxBox as box, type BoxBox as Box } from '../../box/prefixed'

function fitV(viewBox: Box, r: number): Box {
  const height = viewBox.height
  const width = height * r
  return box((viewBox.width - width) / 2, 0, width, height)
}

function fitH(viewBox: Box, rI: number): Box {
  const width = viewBox.width
  const height = width / rI
  return box(0, (viewBox.height - height) / 2, width, height)
}

export type FitReturn = Readonly<{
  outer: Box
  inner: Box
  scale: number
  rO: number
  rI: number
  v: boolean
}>

export function fit(origOuter: Box, origInner: Box): FitReturn {
  const rO = origOuter.width / origOuter.height
  const rI = origInner.width / origInner.height

  // outer is wider => inner fits vertically
  const v = rO > rI

  const outer = v ? fitV(origOuter, rI) : fitH(origOuter, rI)
  const inner = v ? fitV(origInner, rO) : fitH(origInner, rO)
  const scale = v
    ? origInner.height / origOuter.height
    : origInner.width / origOuter.width

  return { outer, inner, scale, rO, rI, v }
}

export function fitSquare({ x, y, width, height }: Box): Box {
  const l = Math.max(width, height)
  const d = Math.abs(width - height) / 2
  return {
    x: width < height ? x - d : x,
    y: width > height ? y - d : y,
    width: l,
    height: l,
  }
}
