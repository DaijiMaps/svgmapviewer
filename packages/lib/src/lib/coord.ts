import { type BoxBox as Box, boxCopy, boxUnit } from './box/prefixed'
import type {
  HtmlLayoutCoord,
  LayoutConfig,
  LayoutCoord,
  SvgLayoutCoord,
} from './layout-types'
import { toDOMMatrix } from './matrix'
import { type MatrixMatrix as Matrix, matrixMultiply } from './matrix/prefixed'
import { fromTransform, invMove, invScale } from './transform'
import { vecScale } from './vec/prefixed'

//// LayoutCoord
//// makeCoord
//// toMatrixOuter
//// fromMatrixSvg

export const emptyLayoutCoord: Readonly<LayoutCoord> = {
  container: boxUnit,
  scroll: boxUnit,
  svg: boxUnit,
  svgOffset: { x: 0, y: 0 },
  svgScale: { s: 1 },
}

export const makeCoord = ({
  container,
  svg,
  svgOffset,
  svgScale,
}: Readonly<LayoutConfig>): LayoutCoord => {
  return {
    container: boxCopy(container),
    scroll: boxCopy(container),
    svgOffset: invMove(svgOffset),
    svgScale,
    svg: boxCopy(svg),
  }
}

export const toMatrixOuter = ({ scroll }: Readonly<LayoutCoord>): Matrix => {
  return fromTransform(invMove(scroll))
}

export const fromMatrixOuter = ({ scroll }: Readonly<LayoutCoord>): Matrix => {
  return fromTransform(scroll)
}

// svg -> container (window)
export const fromMatrixSvg = ({
  scroll,
  svgOffset,
  svgScale,
  svg,
}: Readonly<LayoutCoord>): DOMMatrixReadOnly => {
  const m = [
    fromTransform(scroll),
    fromTransform(invMove(svgOffset)),
    fromTransform(invScale(svgScale)),
    fromTransform(invMove(svg)),
  ].reduce(matrixMultiply)
  return toDOMMatrix(m)
}

// svg -> scroll (content)
export const fromSvgToOuter = ({
  svgOffset,
  svgScale,
  svg,
}: Readonly<SvgLayoutCoord>): DOMMatrixReadOnly => {
  return new DOMMatrixReadOnly()
    .translate(-svgOffset.x, -svgOffset.y)
    .scale(1 / svgScale.s, 1 / svgScale.s)
    .translate(-svg.x, -svg.y)
}

// inverse x/y
export const fromScroll = (s: Box): Box => vecScale(s, -1)
export const toScroll = (s: Box): Box => vecScale(s, -1)

////

export { type HtmlLayoutCoord, type LayoutCoord, type SvgLayoutCoord }
