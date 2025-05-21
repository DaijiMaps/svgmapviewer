import { pipe } from 'fp-ts/lib/function'
import { ReadonlyDeep } from 'type-fest'
import {
  BoxBox as Box,
  boxCenter,
  boxCopy,
  boxMove,
  boxMoveTo,
  boxScaleAt,
  boxUnit,
} from './box/prefixed'
import { svgMapViewerConfig } from './config'
import {
  LayoutCoord,
  fromMatrixOuter,
  fromMatrixSvg,
  fromScroll,
  makeCoord,
  toMatrixOuter,
  toMatrixSvg,
} from './coord'
import { fit } from './fit'
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
  container: Box
): LayoutConfig {
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

export function resizeLayout(size: Box) {
  // XXX
  // XXX
  // XXX
  // XXX config.fontSize (coming from getComputedStyle()) is unstable???
  // XXX
  // XXX
  // XXX
  //const { fontSize } = getComputedStyle(document.body)
  const fontSize = '16px'
  const origViewBox = svgMapViewerConfig.origViewBox
  const layout = makeLayout(
    configLayout(parseFloat(fontSize), origViewBox, size)
  )
  return layout
}

//// expandLayoutCenter
//// expandLayout

export const expandLayoutCenter = (layout: Layout, expand: number): Layout => {
  return expandLayout(layout, expand, boxCenter(layout.scroll))
}

export const expandLayout = (
  layout: Layout,
  s: number,
  cursor: Vec
): Layout => {
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

export const relocLayout = (layout: Layout, dest: Vec): Layout => {
  return {
    ...layout,
    scroll: boxMoveTo(layout.scroll, dest),
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

export const recenterLayout = (layout: Layout, start: Vec): Layout => {
  const d = vecSub(layout.scroll, start)
  const dsvg = vecScale(d, -layout.svgScale.s)

  return {
    ...layout,
    scroll: boxMoveTo(layout.scroll, start),
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

export const toSvg = (p: Vec, layout: Readonly<LayoutCoord>): Vec =>
  transformPoint(toMatrixSvg(layout), p)
export const fromSvg = (p: Vec, layout: Readonly<LayoutCoord>): Vec =>
  transformPoint(fromMatrixSvg(layout), p)
export const toOuter = (p: Vec, layout: Readonly<LayoutCoord>): Vec =>
  transformPoint(toMatrixOuter(layout), p)
export const fromOuter = (p: Vec, layout: Readonly<LayoutCoord>): Vec =>
  transformPoint(fromMatrixOuter(layout), p)
