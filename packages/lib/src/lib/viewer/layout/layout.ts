import { pipe } from 'fp-ts/function'

//import { type ReadonlyDeep } from 'type-fest'
import {
  boxCenter,
  boxMove,
  boxMoveTo,
  boxScaleAt,
  boxUnit,
  type BoxBox,
} from '../../box/prefixed'
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
import { type Scale } from './transform'
import {
  dommatrixreadonlyRotateAt,
  dommatrixreadonlyScaleTranslateOnly,
  dommatrixreadonlyScaleAt,
  dommatrixreadonlyTranslateOnly,
  dommatrixreadonlyMakeTranslateOnly,
  dommatrixreadonlyMakeScaleOnly,
  dommatrixreadonlyTranslate,
} from '../../matrix/dommatrixreadonly'

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
  svg: BoxBox,
  container: BoxBox
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
  origViewBox: BoxBox,
  fontSize: number,
  size: BoxBox
): Layout {
  // XXX
  // XXX
  // XXX
  // XXX config.fontSize (coming from getComputedStyle()) is unstable???
  // XXX
  // XXX
  // XXX
  //const { fontSize } = getComputedStyle(document.body)
  return makeLayout(configLayout(fontSize, origViewBox, size))
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

  const scroll = boxScaleAt(layout.scroll, [sx, sy], cursor.x, cursor.y)
  const scroll_ = dommatrixreadonlyTranslateOnly(
    dommatrixreadonlyScaleAt(layout.scroll_, sx, sy, cursor.x, cursor.y)
  )

  const svgOffset = vecScale(layout.svgOffset, [sx, sy])
  const svgOffset_ = dommatrixreadonlyScaleTranslateOnly(
    layout.svgOffset_,
    sx,
    sy
  )

  const svg = boxScaleAt(layout.svg, [sx, sy], o.x, o.y)
  const svg_ = dommatrixreadonlyTranslateOnly(
    dommatrixreadonlyScaleAt(layout.svg_, sx, sy, o.x, o.y)
  )

  return {
    ...layout,
    scroll,
    scroll_,
    svgOffset,
    svgOffset_,
    svg,
    svg_,
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
    scroll_: dommatrixreadonlyMakeTranslateOnly(dest.x, dest.y),
  }
}

export function moveLayout(layout: Layout, move: Vec): Layout {
  return {
    ...layout,
    scroll: boxMove(layout.scroll, move),
    scroll_: dommatrixreadonlyTranslateOnly(
      dommatrixreadonlyTranslate(layout.scroll_, move.x, move.y)
    ),
  }
}

export function zoomLayout(
  layout: Layout,
  svg: BoxBox,
  svgScale: Scale
): Layout {
  return {
    ...layout,
    svg,
    svg_: dommatrixreadonlyMakeTranslateOnly(svg.x, svg.y),
    svgScale,
    svgScale_: dommatrixreadonlyMakeScaleOnly(svgScale.s, svgScale.s),
  }
}

// always rotate at scroll's center
export function rotateLayout(layout: Layout, deg: number): Layout {
  const ox = layout.scroll.width / 2
  const oy = layout.scroll.height / 2
  const content = dommatrixreadonlyRotateAt(layout.content, deg, ox, oy)

  return {
    ...layout,
    content,
  }
}

export function recenterLayout(layout: Layout, start: Vec): Layout {
  const scroll = boxMoveTo(layout.scroll, start)
  const scroll_ = dommatrixreadonlyMakeTranslateOnly(start.x, start.y)

  const m = layout.content.inverse()

  const o = boxCenter(layout.scroll) // vecVec(layout.scroll.width / 2, layout.scroll.height / 2)
  const d = vecSub(layout.scroll, start)
  const p = vecAdd(o, d)

  const o1 = m.transformPoint(o)
  const p1 = m.transformPoint(p)
  const dcontent = vecSub(p1, o1)

  const dsvg = vecScale(dcontent, -layout.svgScale.s)

  const svg = boxMove(layout.svg, dsvg)
  const svg_ = dommatrixreadonlyTranslateOnly(layout.svg_).translate(
    dsvg.x,
    dsvg.y
  )

  return {
    ...layout,
    scroll,
    scroll_,
    svg,
    svg_,
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
