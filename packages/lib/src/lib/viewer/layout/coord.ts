import { boxUnit, type BoxBox } from '../../box/prefixed'
import { dommatrixreadonly as matrix } from '../../matrix/dommatrixreadonly'
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

//// LayoutCoord
//// makeCoord
//// fromScrollToContainer
//// fromSvgToContainer

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

// scroll -> container
export function fromScrollToContainer({
  scroll,
}: Readonly<ScrollLayoutCoord>): DOMMatrixReadOnly {
  return matrix().translate(scroll.x, scroll.y)
}

export function fromContentToScroll({
  content,
}: Readonly<ContentLayoutCoord>): DOMMatrixReadOnly {
  return content
}

// svg -> content
export function fromSvgToContent(
  m: Readonly<SvgLayoutCoord>
): DOMMatrixReadOnly {
  return matrix()
    .multiply(fromSvgOuterToContent(m))
    .multiply(fromSvgInnerToSvgOuter(m))
    .multiply(fromSvgToSvgInner(m))
}

export function fromSvgOuterToContent({
  svgOffset,
}: Readonly<SvgLayoutCoord>): DOMMatrixReadOnly {
  return matrix().translate(-svgOffset.x, -svgOffset.y)
}

export function fromSvgInnerToSvgOuter({
  svgScale,
}: Readonly<SvgLayoutCoord>): DOMMatrixReadOnly {
  return matrix().scale(1 / svgScale, 1 / svgScale)
}

export function fromSvgToSvgInner({
  svg,
}: Readonly<SvgLayoutCoord>): DOMMatrixReadOnly {
  return matrix().translate(-svg.x, -svg.y)
}

// svg -> scroll
export function fromSvgToScroll(
  m: Readonly<ContentLayoutCoord & SvgLayoutCoord>
): DOMMatrixReadOnly {
  return m.content.multiply(fromSvgToContent(m))
}

// svg -> container
export function fromSvgToContainer(
  m: Readonly<LayoutCoord>
): DOMMatrixReadOnly {
  return fromScrollToContainer(m).multiply(fromSvgToScroll(m))
}

// inverse x/y
export function fromDOMScroll(s: BoxBox): BoxBox {
  return vecScale(s, -1)
}
export function toDOMScroll(s: BoxBox): BoxBox {
  return vecScale(s, -1)
}

export { type LayoutCoord, type ScrollLayoutCoord, type SvgLayoutCoord }
