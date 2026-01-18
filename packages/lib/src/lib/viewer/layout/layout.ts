import { pipe } from 'fp-ts/function'
//import { type ReadonlyDeep } from 'type-fest'
import {
  boxCenter,
  //boxEq,
  boxMove,
  boxMoveTo,
  boxScaleAt,
  boxUnit,
  type BoxBox,
} from '../../box/prefixed'
import { dommatrixreadonlyRotateAt } from '../../matrix/dommatrixreadonly'
import {
  vecAdd,
  vecScale,
  vecSub,
  type VecVec as Vec,
} from '../../vec/prefixed'
import {
  emptyLayoutCoord,
  fromMatrixSvg,
  fromDOMScroll,
  makeCoord,
} from './coord'
import { fit } from './fit'
import {
  type Layout,
  type LayoutConfig,
  type LayoutCoord,
  type ScrollLayoutCoord,
  type SvgLayoutCoord,
} from './layout-types'

//// LayoutConfig
//// Layout

export const emptyLayoutConfig: Readonly<LayoutConfig> = {
  fontSize: 16,
  container: boxUnit,
  outer: boxUnit,
  inner: boxUnit,
  svgScale: 1,
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
  container: BoxBox,
  svg: BoxBox,
  svgContent?: BoxBox
  // XXX svgContent?: BoxBox
): LayoutConfig {
  const { outer, scale: s } = fit(container, svgContent ?? svg)

  return {
    fontSize,
    container,
    outer: outer,
    inner: svgContent ?? svg,
    svgScale: s,
  }
}

export function makeLayout(config: LayoutConfig): Layout {
  return {
    config,
    ...makeCoord(config),
  }
}

// reset (recenter) but keep rotate
export function resetLayout({ config, content }: Layout): Layout {
  return {
    config,
    ...makeCoord(config),
    content, // preserve rotate
  }
}

export function resizeLayout(
  fontSize: number,
  container: BoxBox,
  origViewBox: BoxBox,
  origBoundingBox?: BoxBox
): Layout {
  // XXX
  // XXX
  // XXX
  // XXX config.fontSize (coming from getComputedStyle()) is unstable???
  // XXX
  // XXX
  // XXX
  //const { fontSize } = getComputedStyle(document.body)
  return expandLayout1(
    makeLayout(configLayout(fontSize, container, origViewBox, origBoundingBox))
  )
}

//// expandLayout1
//// expandLayoutCenter
//// expandLayout

export function expandLayout1(layout: Layout): Layout {
  const cursor = boxCenter(layout.scroll)

  // (expand to be squared) * (scale)
  const ratio = layout.container.width / layout.container.height
  const sx = ratio < 1 ? 1 / ratio : 1
  const sy = ratio < 1 ? 1 : 1 * ratio

  return expandLayout(layout, sx, sy, cursor)
}

export function expandLayoutCenter(layout: Layout, expand: number): Layout {
  const cursor = boxCenter(layout.scroll)

  return expandLayout(layout, expand, expand, cursor)
}

function expandLayout(
  layout: Layout,
  sx: number,
  sy: number,
  cursor: Vec
): Layout {
  const m = fromMatrixSvg(layout).inverse()
  const o = m.transformPoint(cursor)

  const scroll = boxScaleAt(layout.scroll, [sx, sy], cursor.x, cursor.y)

  const svgOffset = vecScale(layout.svgOffset, [sx, sy])

  const svg = boxScaleAt(layout.svg, [sx, sy], o.x, o.y)

  return {
    ...layout,
    scroll,
    svgOffset,
    svg,
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

export function zoomLayout(
  layout: Layout,
  svg: BoxBox,
  svgScale: number
): Layout {
  return {
    ...layout,
    svg,
    svgScale,
  }
}

// always rotate at scroll's center
export function rotateLayout(layout: Layout, deg: number): Layout {
  const o = boxCenter({ ...layout.scroll, x: 0, y: 0 })
  const content = dommatrixreadonlyRotateAt(deg, o.x, o.y).multiply(
    layout.content
  )

  return {
    ...layout,
    content,
  }
}

export function recenterLayout(layout: Layout, start: Vec): Layout {
  const scroll = boxMoveTo(layout.scroll, start)

  const m = layout.content.inverse()

  const o = boxCenter(layout.scroll) // vecVec(layout.scroll.width / 2, layout.scroll.height / 2)
  const d = vecSub(layout.scroll, start)
  const p = vecAdd(o, d)

  const o1 = m.transformPoint(o)
  const p1 = m.transformPoint(p)
  const dcontent = vecSub(p1, o1)

  const dsvg = vecScale(dcontent, -layout.svgScale)

  const svg = boxMove(layout.svg, dsvg)

  return {
    ...layout,
    scroll,
    svg,
  }
}

// reflect DOM scroll value and recenter
export function scrollLayout(layout: Layout, domscroll: BoxBox): Layout {
  const start: Vec = layout.scroll
  const stop: Vec = fromDOMScroll(domscroll)
  const move = vecSub(stop, start)
  return pipe(
    layout,
    (l) => moveLayout(l, move),
    (l) => recenterLayout(l, start)
  )
}

////

export {
  type Layout,
  type LayoutConfig,
  type LayoutCoord,
  type ScrollLayoutCoord,
  type SvgLayoutCoord,
}
