//import { type ReadonlyDeep } from 'type-fest'
import { type BoxBox } from '../../box/prefixed'
import { type Move, type Scale } from './transform'

// C: client coord
// S: svg coord

export interface ContainerLayoutCoord {
  // container (C) size
  readonly container: BoxBox
}

export interface ScrollLayoutCoord {
  // scroll (C) -> container (C)
  readonly scroll: BoxBox
  readonly scroll_: DOMMatrixReadOnly
}

export interface ContentLayoutCoord {
  // content (C) -> svg (C)
  readonly content: DOMMatrixReadOnly
}

export interface SvgLayoutCoord {
  // svg (C) -> svg viewbox (C)
  readonly svgOffset: Move
  readonly svgOffset_: DOMMatrixReadOnly

  // svg viewbox ratio (C -> S)
  readonly svgScale: Scale
  readonly svgScale_: DOMMatrixReadOnly

  // svg viewbox (S) -> svg origin (S)
  readonly svg: BoxBox
  readonly svg_: DOMMatrixReadOnly
}

export type LayoutCoord = ContainerLayoutCoord &
  ScrollLayoutCoord &
  ContentLayoutCoord &
  SvgLayoutCoord

export type FontLayoutConfig = Readonly<{
  readonly fontSize: number
}>

export type ContainerLayoutConfig = Readonly<{
  readonly container: BoxBox
}>

export type SvgLayoutConfig = Readonly<{
  readonly svgOffset: Move
  readonly svgScale: Scale
  readonly svg: BoxBox
}>

export type LayoutConfig = FontLayoutConfig &
  ContainerLayoutConfig &
  SvgLayoutConfig

export type Layout = Readonly<
  LayoutCoord & {
    readonly config: LayoutConfig
  }
>
