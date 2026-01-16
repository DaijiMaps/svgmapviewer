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

////

export type FontLayoutConfig = Readonly<{
  readonly fontSize: number
}>

export type ContainerLayoutConfig = Readonly<{
  readonly container: BoxBox
}>

export type SvgLayoutConfig = Readonly<{
  readonly outer: BoxBox
  readonly inner: BoxBox
  readonly svgScale: Scale
}>

export type LayoutConfig = FontLayoutConfig &
  ContainerLayoutConfig &
  SvgLayoutConfig

////

export type Layout = Readonly<
  LayoutCoord & {
    readonly config: LayoutConfig
  }
>
