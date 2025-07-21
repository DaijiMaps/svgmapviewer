import { type BoxBox as Box, boxCopy, boxUnit } from '../box/prefixed'
import { vecScale } from '../vec/prefixed'
import type {
  ContentLayoutCoord,
  LayoutConfig,
  LayoutCoord,
  ScrollLayoutCoord,
  SvgLayoutCoord,
} from './layout-types'

//// LayoutCoord
//// makeCoord
//// fromMatrixOuter
//// fromMatrixSvg

export const emptyLayoutCoord: Readonly<LayoutCoord> = {
  container: boxUnit,
  scroll: boxUnit,
  content: new DOMMatrixReadOnly(),
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
    content: new DOMMatrixReadOnly(),
    svgOffset,
    svgScale,
    svg: boxCopy(svg),
  }
}

export const fromContentToScroll = ({
  content,
}: Readonly<ContentLayoutCoord>): DOMMatrixReadOnly => {
  return content
}

// svg -> content
export const fromSvgToContent = ({
  svgOffset,
  svgScale,
  svg,
}: Readonly<ContentLayoutCoord & SvgLayoutCoord>): DOMMatrixReadOnly => {
  return new DOMMatrixReadOnly()
    .translate(-svgOffset.x, -svgOffset.y)
    .scale(1 / svgScale.s, 1 / svgScale.s)
    .translate(-svg.x, -svg.y)
}

// svg -> scroll
export const fromSvgToScroll = ({
  content,
  svgOffset,
  svgScale,
  svg,
}: Readonly<ContentLayoutCoord & SvgLayoutCoord>): DOMMatrixReadOnly => {
  return new DOMMatrixReadOnly()
    .multiply(content)
    .translate(-svgOffset.x, -svgOffset.y)
    .scale(1 / svgScale.s, 1 / svgScale.s)
    .translate(-svg.x, -svg.y)
}

// scroll -> container
export const fromMatrixOuter = ({
  scroll,
}: Readonly<LayoutCoord>): DOMMatrixReadOnly => {
  return new DOMMatrixReadOnly().translate(scroll.x, scroll.y)
}

// svg -> container
export const fromMatrixSvg = ({
  scroll,
  content,
  svgOffset,
  svgScale,
  svg,
}: Readonly<LayoutCoord>): DOMMatrixReadOnly => {
  return new DOMMatrixReadOnly()
    .translate(scroll.x, scroll.y)
    .multiply(content)
    .translate(-svgOffset.x, -svgOffset.y)
    .scale(1 / svgScale.s, 1 / svgScale.s)
    .translate(-svg.x, -svg.y)
}

// inverse x/y
export const fromScroll = (s: Box): Box => vecScale(s, -1)
export const toScroll = (s: Box): Box => vecScale(s, -1)

export { type LayoutCoord, type ScrollLayoutCoord, type SvgLayoutCoord }
