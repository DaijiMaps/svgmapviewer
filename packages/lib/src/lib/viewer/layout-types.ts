//import { type ReadonlyDeep } from 'type-fest'
import { type BoxBox as Box } from '../box/prefixed'
import { type Move, type Scale } from './transform'

// C: client coord
// S: svg coord

export interface ContainerLayoutCoord {
  // container (C) size
  readonly container: Box
}

export interface ScrollLayoutCoord {
  // scroll (C) -> container (C)
  readonly scroll: Box
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
  readonly svg: Box
}

export type LayoutCoord = ContainerLayoutCoord &
  ScrollLayoutCoord &
  ContentLayoutCoord &
  SvgLayoutCoord

export type LayoutConfig = Readonly<{
  readonly fontSize: number
  readonly container: Box
  readonly svgOffset: Move
  readonly svgScale: Scale
  readonly svg: Box
}>

export type Layout = Readonly<
  LayoutCoord & {
    readonly config: LayoutConfig
  }
>
