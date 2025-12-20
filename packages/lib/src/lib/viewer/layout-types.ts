//import { type ReadonlyDeep } from 'type-fest'
import { type BoxBox } from '../box/prefixed'
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
}

export interface ContentLayoutCoord {
  // content (C) -> svg (C)
  readonly content: DOMMatrixReadOnly
}

export interface SvgLayoutCoord {
  // svg (C) -> svg viewbox (C)
  readonly svgOffset: Move

  // svg viewbox ratio (C -> S)
  readonly svgScale: Scale

  // svg viewbox (S) -> svg origin (S)
  readonly svg: BoxBox
}

export type LayoutCoord = ContainerLayoutCoord &
  ScrollLayoutCoord &
  ContentLayoutCoord &
  SvgLayoutCoord

export type LayoutConfig = Readonly<{
  readonly fontSize: number
  readonly container: BoxBox
  readonly svgOffset: Move
  readonly svgScale: Scale
  readonly svg: BoxBox
}>

export type Layout = Readonly<
  LayoutCoord & {
    readonly config: LayoutConfig
  }
>
