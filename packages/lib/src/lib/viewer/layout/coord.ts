import { boxUnit, type BoxBox } from '../../box/prefixed'
import { vecScale } from '../../vec/prefixed'
import {
  type ContainerLayoutConfig,
  type ContentLayoutCoord,
  type FontLayoutConfig,
  type LayoutConfig,
  type LayoutCoord,
  type ScrollLayoutCoord,
  type SvgLayoutConfig,
  type SvgLayoutCoord,
} from './layout-types'
import { dommatrixreadonly as matrix } from '../../matrix/dommatrixreadonly'

//// LayoutCoord
//// makeCoord
//// fromMatrixOuter
//// fromMatrixSvg

export const emptyFontLayoutConfig: FontLayoutConfig = {
  fontSize: 16,
}

export const emptyContainerLayoutConfig: ContainerLayoutConfig = {
  container: boxUnit,
}

export const emptySvgLayoutConfig: SvgLayoutConfig = {
  outer: boxUnit,
  inner: boxUnit,
  svgScale: 1,
}

export const emptyLayoutConfig: LayoutConfig = {
  ...emptyFontLayoutConfig,
  ...emptyContainerLayoutConfig,
  ...emptySvgLayoutConfig,
}

////

export const emptyLayoutCoord: Readonly<LayoutCoord> = {
  container: boxUnit,
  scroll: boxUnit,
  content: matrix(),
  svgOffset: { x: -0, y: -0 },
  svgScale: 1,
  svg: boxUnit,
}

////

export function makeCoord({
  container,
  outer,
  svgScale,
  inner,
}: ContainerLayoutConfig & SvgLayoutConfig): LayoutCoord {
  const { x, y } = outer
  return {
    container: container,
    scroll: container,
    content: matrix(),
    svgOffset: { x: -x, y: -y },
    svgScale,
    svg: inner,
  }
}

////

export function fromContentToScroll({
  content,
}: Readonly<ContentLayoutCoord>): DOMMatrixReadOnly {
  return content
}

// svg -> content
export function fromSvgToContent({
  svgOffset,
  svgScale,
  svg,
}: Readonly<SvgLayoutCoord>): DOMMatrixReadOnly {
  return matrix()
    .translate(-svgOffset.x, -svgOffset.y)
    .scale(1 / svgScale, 1 / svgScale)
    .translate(-svg.x, -svg.y)
}

// svg -> scroll
export function fromSvgToScroll({
  content,
  svgOffset,
  svgScale,
  svg,
}: Readonly<ContentLayoutCoord & SvgLayoutCoord>): DOMMatrixReadOnly {
  return content
    .translate(-svgOffset.x, -svgOffset.y)
    .scale(1 / svgScale, 1 / svgScale)
    .translate(-svg.x, -svg.y)
}

// scroll -> container
export function fromMatrixOuter({
  scroll,
}: Readonly<ScrollLayoutCoord>): DOMMatrixReadOnly {
  return matrix().translate(scroll.x, scroll.y)
}

// svg -> container
export function fromMatrixSvg({
  scroll,
  content,
  svgOffset,
  svgScale,
  svg,
}: Readonly<LayoutCoord>): DOMMatrixReadOnly {
  return matrix()
    .translate(scroll.x, scroll.y)
    .multiply(content)
    .translate(-svgOffset.x, -svgOffset.y)
    .scale(1 / svgScale, 1 / svgScale)
    .translate(-svg.x, -svg.y)
}

// inverse x/y
export function fromDOMScroll(s: BoxBox): BoxBox {
  return vecScale(s, -1)
}
export function toDOMScroll(s: BoxBox): BoxBox {
  return vecScale(s, -1)
}

export { type LayoutCoord, type ScrollLayoutCoord, type SvgLayoutCoord }
