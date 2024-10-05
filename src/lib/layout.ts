import { pipe } from 'fp-ts/lib/function'
import { ReadonlyDeep } from 'type-fest'
import {
  BoxBox as Box,
  boxCenter,
  boxCopy,
  boxMove,
  boxScaleAt,
  boxUnit,
} from './box/prefixed'
import { svgMapViewerConfig } from './config'
import {
  fromMatrixOuter,
  fromMatrixSvg,
  fromScroll,
  LayoutCoord,
  makeCoord,
  toMatrixOuter,
  toMatrixSvg,
} from './coord'
import { fit } from './fit'
import { getBodySize } from './resize-react'
import { Move, Scale, transformPoint } from './transform'
import { VecVec as Vec, vecScale, vecSub } from './vec/prefixed'

//// LayoutConfig
//// Layout

export type LayoutConfig = ReadonlyDeep<{
  readonly fontSize: number
  readonly container: Box
  readonly svg: Box
  readonly svgOffset: Move
  readonly svgScale: Scale
}>

export type Layout = ReadonlyDeep<
  LayoutCoord & {
    config: LayoutConfig
  }
>

export const emptyLayout: Layout = {
  config: {
    fontSize: 16,
    container: boxUnit,
    svg: boxUnit,
    svgOffset: { x: 0, y: 0 },
    svgScale: { s: 1 },
  },
  container: boxUnit,
  scroll: boxUnit,
  svg: boxUnit,
  svgOffset: { x: 0, y: 0 },
  svgScale: { s: 1 },
}

//// configLayout
//// makeLayout

export function configLayout(
  fontSize: number,
  svg: Box,
  origBody?: Box
): LayoutConfig {
  const container: Box = origBody !== undefined ? origBody : getBodySize()
  const [[x, y], s] = fit(container, svg)

  return {
    fontSize,
    container,
    svg,
    svgOffset: { x, y },
    svgScale: { s },
  }
}

export function makeLayout(config: LayoutConfig): Layout {
  const coord = makeCoord(config)

  const layout = {
    config,
    ...coord,
  }

  return layout
}

//// expandLayoutCenter
//// expandLayout

export const expandLayoutCenter = (layout: Layout, expand: number): Layout => {
  return expandLayout(layout, expand, boxCenter(layout.scroll))
}

export const expandLayout = (layout: Layout, s: number, cursor: Vec): Layout => {
  const o = toSvg(cursor, layout)

  return {
    ...layout,
    scroll: boxScaleAt(layout.scroll, s, cursor.x, cursor.y),
    svgOffset: vecScale(layout.svgOffset, s),
    svg: boxScaleAt(layout.svg, s, o.x, o.y),
  }
}

//// relocLayout
//// moveLayout
//// zoomLayout
//// recenterLayout
//// scrollLayout

export const relocLayout = (layout: Layout, dest: Box): Layout => {
  return {
    ...layout,
    scroll: boxCopy(dest),
  }
}

export const moveLayout = (layout: Layout, move: Vec): Layout => {
  return {
    ...layout,
    scroll: boxMove(layout.scroll, move),
  }
}

export const zoomLayout = (
  layout: Layout,
  svg: Box,
  svgScale: Scale
): Layout => {
  return {
    ...layout,
    svg: boxCopy(svg),
    svgScale,
  }
}

export const recenterLayout = (layout: Layout, start: Box): Layout => {
  const d = vecSub(layout.scroll, start)
  const dsvg = vecScale(d, -layout.svgScale.s)

  return {
    ...layout,
    scroll: boxCopy(start),
    svg: boxMove(layout.svg, dsvg),
  }
}

export const scrollLayout = (layout: Layout, scroll: Box): Layout => {
  const move = vecSub(fromScroll(scroll), layout.scroll)
  return pipe(
    layout,
    (l) => moveLayout(l, move),
    (l) => recenterLayout(l, boxCopy(layout.scroll))
  )
}

//// toSvg
//// fromSvg
//// toOuter
//// fromOuter

export const toSvg = (p: Vec, layout?: Layout): Vec =>
  transformPoint(toMatrixSvg(layout ?? svgMapViewerConfig.layout), p)
export const fromSvg = (p: Vec, layout?: Layout): Vec =>
  transformPoint(fromMatrixSvg(layout ?? svgMapViewerConfig.layout), p)
export const toOuter = (p: Vec, layout?: Layout): Vec =>
  transformPoint(toMatrixOuter(layout ?? svgMapViewerConfig.layout), p)
export const fromOuter = (p: Vec, layout?: Layout): Vec =>
  transformPoint(fromMatrixOuter(layout ?? svgMapViewerConfig.layout), p)
