//import { type ReadonlyDeep } from 'type-fest'
import { type BoxBox as Box } from './box/prefixed'
import { type Move, type Scale } from './transform'

// C: client coord
// S: svg coord

export interface HtmlLayoutCoord {
  // container (C) size
  container: Box

  // scroll (C) -> svg (C)
  scroll: Box
}

export interface SvgLayoutCoord {
  // svg (C) -> svg viewbox (C)
  svgOffset: Move

  // svg viewbox ratio (C -> S)
  svgScale: Scale

  // svg viewbox (S) -> svg origin (S)
  svg: Box
}

export type LayoutCoord = HtmlLayoutCoord & SvgLayoutCoord

export type LayoutConfig = Readonly<{
  readonly fontSize: number
  readonly container: Box
  readonly svg: Box
  readonly svgOffset: Move
  readonly svgScale: Scale
}>

export type Layout = Readonly<
  LayoutCoord & {
    config: LayoutConfig
  }
>
