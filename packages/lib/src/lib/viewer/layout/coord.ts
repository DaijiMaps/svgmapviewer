import { boxUnit, type BoxBox } from '../../box/prefixed'
import { vecScale } from '../../vec/prefixed'
import {
  type ContainerLayoutConfig,
  type ContentLayoutCoord,
  type LayoutCoord,
  type ScrollLayoutCoord,
  type SvgLayoutConfig,
  type SvgLayoutCoord,
} from './layout-types'

//// LayoutCoord
//// makeCoord
//// fromMatrixOuter
//// fromMatrixSvg

export const emptyLayoutCoord: Readonly<LayoutCoord> = {
  container: boxUnit,
  scroll: boxUnit,
  scroll_: new DOMMatrixReadOnly(),
  content: new DOMMatrixReadOnly(),
  svgOffset: { x: 0, y: 0 },
  svgOffset_: new DOMMatrixReadOnly(),
  svgScale: { s: 1 },
  svgScale_: new DOMMatrixReadOnly(),
  svg: boxUnit,
  svg_: new DOMMatrixReadOnly(),
}

export function makeCoord({
  container,
  svgOffset,
  svgScale,
  svg,
}: ContainerLayoutConfig & SvgLayoutConfig): LayoutCoord {
  const { x, y } = svgOffset
  const { s } = svgScale
  return {
    container: container,
    scroll: container,
    scroll_: new DOMMatrixReadOnly([1, 0, 0, 1, container.x, container.y]),
    content: new DOMMatrixReadOnly(),
    svgOffset,
    svgOffset_: new DOMMatrixReadOnly([1, 0, 0, 1, x, y]),
    svgScale,
    svgScale_: new DOMMatrixReadOnly([s, 0, 0, s, 0, 0]),
    svg,
    svg_: new DOMMatrixReadOnly([1, 0, 0, 1, svg.x, svg.y]),
  }
}

export function fromContentToScroll({
  content,
}: Readonly<ContentLayoutCoord>): DOMMatrixReadOnly {
  return content
}

// svg -> content
export function fromSvgToContent({
  svgOffset_,
  svgScale_,
  svg_,
}: Readonly<SvgLayoutCoord>): DOMMatrixReadOnly {
  return svgOffset_
    .inverse()
    .multiply(svgScale_.inverse())
    .multiply(svg_.inverse())
}

// svg -> scroll
export function fromSvgToScroll({
  content,
  svgOffset_,
  svgScale_,
  svg_,
}: Readonly<ContentLayoutCoord & SvgLayoutCoord>): DOMMatrixReadOnly {
  return content
    .multiply(svgOffset_.inverse())
    .multiply(svgScale_.inverse())
    .multiply(svg_.inverse())
}

// scroll -> container
export function fromMatrixOuter({
  scroll_,
}: Readonly<ScrollLayoutCoord>): DOMMatrixReadOnly {
  return scroll_
}

// svg -> container
export function fromMatrixSvg({
  scroll_,
  content,
  svgOffset_,
  svgScale_,
  svg_,
}: Readonly<LayoutCoord>): DOMMatrixReadOnly {
  return scroll_
    .multiply(content)
    .multiply(svgOffset_.inverse())
    .multiply(svgScale_.inverse())
    .multiply(svg_.inverse())
}

// inverse x/y
export function fromDOMScroll(s: BoxBox): BoxBox {
  return vecScale(s, -1)
}
export function toDOMScroll(s: BoxBox): BoxBox {
  return vecScale(s, -1)
}

export { type LayoutCoord, type ScrollLayoutCoord, type SvgLayoutCoord }
