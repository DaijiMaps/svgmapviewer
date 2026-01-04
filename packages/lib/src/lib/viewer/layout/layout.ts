import { pipe } from 'fp-ts/function'

//import { type ReadonlyDeep } from 'type-fest'
import {
  boxCenter,
  boxCopy,
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
  vecVec,
  type VecVec as Vec,
} from '../../vec/prefixed'
import { emptyLayoutCoord, fromMatrixSvg, fromScroll, makeCoord } from './coord'
import { fit } from './fit'
import {
  type Layout,
  type LayoutConfig,
  type LayoutCoord,
  type ScrollLayoutCoord,
  type SvgLayoutCoord,
} from './layout-types'
import { type Scale } from './transform'

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
  const coord = makeCoord(config)

  const layout = {
    config,
    ...coord,
  }

  return layout
}

// reset (recenter) but keep rotate
export function resetLayout({ config, content }: Layout): Layout {
  const coord = makeCoord(config)
  const deg = toDeg(content)
  const layout = {
    config,
    ...coord,
  }
  const l = rotateLayout(layout, deg)
  return l
}

function toDeg({ a, b, c, d }: DOMMatrixReadOnly): number {
  const m = new DOMMatrixReadOnly([a, b, c, d, 0, 0])
  const v = m.transformPoint({ x: 1, y: 0 })
  const deg = (Math.atan2(v.y, v.x) / Math.PI) * 180
  return deg
}

// XXX
// XXX
// XXX
export function layoutToDeg(layout: Layout): number {
  return toDeg(layout.content)
}
// XXX
// XXX
// XXX

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

export function zoomLayout(
  layout: Layout,
  svg: BoxBox,
  svgScale: Scale
): Layout {
  return {
    ...layout,
    svg: boxCopy(svg),
    svgScale,
  }
}

export function rotateLayout(layout: Layout, deg: number): Layout {
  const ox = layout.scroll.width / 2
  const oy = layout.scroll.height / 2
  const rotate = new DOMMatrixReadOnly()
    .translate(ox, oy)
    .rotate(deg)
    .translate(-ox, -oy)
  const content = rotate.multiply(layout.content)
  return {
    ...layout,
    content,
  }
}

export function recenterLayout(layout: Layout, start: Vec): Layout {
  const m = layout.content.inverse()

  const o = vecVec(layout.scroll.width / 2, layout.scroll.height / 2)
  const d = vecSub(layout.scroll, start)
  const p = vecAdd(o, d)

  const o1 = m.transformPoint(o)
  const p1 = m.transformPoint(p)
  const dcontent = vecSub(p1, o1)

  const dsvg = vecScale(dcontent, -layout.svgScale.s)

  return {
    ...layout,
    scroll: boxMoveTo(layout.scroll, start),
    svg: boxMove(layout.svg, dsvg),
  }
}

export function scrollLayout(layout: Layout, scroll: BoxBox): Layout {
  const move = vecSub(fromScroll(scroll), layout.scroll)
  return pipe(
    layout,
    (l) => moveLayout(l, move),
    (l) => recenterLayout(l, boxCopy(layout.scroll))
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
