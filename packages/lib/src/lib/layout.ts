import { pipe } from 'fp-ts/lib/function'
//import { type ReadonlyDeep } from 'type-fest'
import {
  type BoxBox as Box,
  boxCenter,
  boxCopy,
  boxMove,
  boxMoveTo,
  boxScaleAt,
  boxUnit,
} from './box/prefixed'
import {
  emptyLayoutCoord,
  fromMatrixSvg,
  fromScroll,
  fromSvgToScroll,
  makeCoord,
} from './coord'
import { fit } from './fit'
import type {
  HtmlLayoutCoord,
  Layout,
  LayoutConfig,
  LayoutCoord,
  SvgLayoutCoord,
} from './layout-types'
import { type Scale } from './transform'
import { type VecVec as Vec, vecScale, vecSub } from './vec/prefixed'

//// LayoutConfig
//// Layout

export const emptyLayoutConfig: Readonly<LayoutConfig> = {
  fontSize: 16,
  container: boxUnit,
  svgOffset: { x: 0, y: 0 },
  svgScale: { s: 1 },
  svg: boxUnit,
}

export const emptyLayout: Layout = {
  ...emptyLayoutCoord,
  config: emptyLayoutConfig,
}

//// configLayout
//// makeLayout

// `original' layout; fit to container (window)
// == layout before expanded
export function configLayout(
  fontSize: number,
  svg: Box,
  container: Box
): LayoutConfig {
  const [[x, y], s] = fit(container, svg)

  return {
    fontSize,
    container,
    svgOffset: { x: -x, y: -y },
    svgScale: { s },
    svg,
  }
}

export function makeLayout(config: LayoutConfig): Layout {
  const coord = makeCoord(config)
  const svgMatrix = fromSvgToScroll(coord)

  const layout = {
    config,
    svgMatrix,
    ...coord,
  }

  return layout
}

export function resizeLayout(
  origViewBox: Box,
  fontSize: number,
  size: Box
): Layout {
  // XXX
  // XXX
  // XXX
  // XXX config.fontSize (coming from getComputedStyle()) is unstable???
  // XXX
  // XXX
  // XXX
  //const { fontSize } = getComputedStyle(document.body)
  const layout = makeLayout(configLayout(fontSize, origViewBox, size))
  return layout
}

//// expandLayoutCenter
//// expandLayout

export function expandLayoutCenter(layout: Layout, expand: number): Layout {
  return expandLayout(layout, expand, boxCenter(layout.scroll))
}

export function expandLayout(layout: Layout, s: number, cursor: Vec): Layout {
  const m = fromMatrixSvg(layout).inverse()
  const o = m.transformPoint(cursor)

  const ratio = layout.container.width / layout.container.height
  const sx = ratio < 1 ? s / ratio : s
  const sy = ratio < 1 ? s : s * ratio

  return {
    ...layout,
    scroll: boxScaleAt(layout.scroll, [sx, sy], cursor.x, cursor.y),
    svgOffset: vecScale(layout.svgOffset, [sx, sy]),
    svg: boxScaleAt(layout.svg, [sx, sy], o.x, o.y),
  }
}

//// relocLayout
//// moveLayout
//// zoomLayout
//// recenterLayout
//// scrollLayout

export function relocLayout(layout: Layout, dest: Vec): Layout {
  return {
    ...layout,
    scroll: boxMoveTo(layout.scroll, dest),
  }
}

export function moveLayout(layout: Layout, move: Vec): Layout {
  return {
    ...layout,
    scroll: boxMove(layout.scroll, move),
  }
}

export function zoomLayout(layout: Layout, svg: Box, svgScale: Scale): Layout {
  return {
    ...layout,
    svg: boxCopy(svg),
    svgScale,
  }
}

export function recenterLayout(layout: Layout, start: Vec): Layout {
  const d = vecSub(layout.scroll, start)
  const dsvg = vecScale(d, -layout.svgScale.s)

  return {
    ...layout,
    scroll: boxMoveTo(layout.scroll, start),
    svg: boxMove(layout.svg, dsvg),
  }
}

export function scrollLayout(layout: Layout, scroll: Box): Layout {
  const move = vecSub(fromScroll(scroll), layout.scroll)
  return pipe(
    layout,
    (l) => moveLayout(l, move),
    (l) => recenterLayout(l, boxCopy(layout.scroll))
  )
}

////

export {
  type HtmlLayoutCoord,
  type Layout,
  type LayoutConfig,
  type LayoutCoord,
  type SvgLayoutCoord,
}
