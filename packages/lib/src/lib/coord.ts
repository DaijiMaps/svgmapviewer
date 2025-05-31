import { type BoxBox as Box, boxCopy, boxUnit } from './box/prefixed'
import type {
  HtmlLayoutCoord,
  LayoutConfig,
  LayoutCoord,
  SvgLayoutCoord,
} from './layout-types'
import { vecScale } from './vec/prefixed'

//// LayoutCoord
//// makeCoord
//// fromMatrixOuter
//// fromMatrixSvg

export const emptyLayoutCoord: Readonly<LayoutCoord> = {
  container: boxUnit,
  scroll: boxUnit,
  svgOffset: { x: 0, y: 0 },
  svgScale: { s: 1 },
  svg: boxUnit,
}

export const makeCoord = ({
  container,
  svgOffset,
  svgScale,
  svg,
}: Readonly<LayoutConfig>): LayoutCoord => {
  return {
    container: boxCopy(container),
    scroll: boxCopy(container),
    svgOffset,
    svgScale,
    svg: boxCopy(svg),
  }
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

// scroll (content) -> container (window)
export const fromMatrixOuter = ({
  scroll,
}: Readonly<LayoutCoord>): DOMMatrixReadOnly => {
  return new DOMMatrixReadOnly().translate(scroll.x, scroll.y)
}

// svg -> container (window)
export const fromMatrixSvg = ({
  scroll,
  svgOffset,
  svgScale,
  svg,
}: Readonly<LayoutCoord>): DOMMatrixReadOnly => {
  return new DOMMatrixReadOnly()
    .translate(scroll.x, scroll.y)
    .translate(-svgOffset.x, -svgOffset.y)
    .scale(1 / svgScale.s, 1 / svgScale.s)
    .translate(-svg.x, -svg.y)
}

// inverse x/y
export const fromScroll = (s: Box): Box => vecScale(s, -1)
export const toScroll = (s: Box): Box => vecScale(s, -1)

export { type HtmlLayoutCoord, type LayoutCoord, type SvgLayoutCoord }
