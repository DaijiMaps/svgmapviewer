import { pipe } from 'fp-ts/lib/function'
import { svgMapViewerConfig } from '../../config'
import { boxCenter, boxScaleAt } from '../box/prefixed'
import { vecAdd, type VecVec as Vec } from '../vec/prefixed'
import type { Animation } from './animation-types'
import { fromMatrixSvg } from './coord'
import { relocLayout, rotateLayout, zoomLayout, type Layout } from './layout'
import { fromTransform, invMove, invScale, transformScale } from './transform'

export const animationZoom = (
  layout: Layout,
  z: number,
  { x, y }: Vec
): Animation => {
  const osvg = fromMatrixSvg(layout).inverse().transformPoint({ x, y })
  const s = 1 / zoomToScale(z)
  const q = new DOMMatrixReadOnly()
    .translate(x, y)
    .scale(1 / s, 1 / s)
    .translate(-x, -y)
  const zoom = {
    svg: boxScaleAt(layout.svg, s, osvg.x, osvg.y),
    svgScale: transformScale(layout.svgScale, s),
    q,
  }
  return {
    move: null,
    zoom,
    rotate: null,
  }
}

export const animationHome = (
  layout: Layout,
  nextLayout: Layout
): Animation => {
  const osvg = boxCenter(nextLayout.config.svg)
  const o = pipe(osvg, (p) => fromMatrixSvg(layout).transformPoint(p))
  const m1 = fromTransform(invMove(o))
  const dm1 = new DOMMatrixReadOnly(m1.flat())

  const s = nextLayout.svgScale.s / layout.svgScale.s
  const m2 = fromTransform(invScale({ s }))
  const dm2 = new DOMMatrixReadOnly(m2.flat())

  const c = boxCenter(layout.container)
  const m3 = fromTransform(c)
  const dm3 = new DOMMatrixReadOnly(m3.flat())

  const q = dm3.multiply(dm2).multiply(dm1)

  const zoom = {
    svg: nextLayout.svg,
    svgScale: nextLayout.svgScale,
    q,
  }

  return {
    move: null,
    zoom,
    rotate: null,
  }
}

export const animationRotate = (
  layout: Layout,
  deg: number,
  cursor: Vec
): Animation => {
  const { x, y } = vecAdd(cursor, layout.scroll)

  const d = new DOMMatrixReadOnly()
    .translate(x, y)
    .rotate(deg)
    .translate(-x, -y)

  const content = d.multiply(layout.content)
  const rotate = {
    deg,
    content,
  }

  return {
    move: null,
    zoom: null,
    rotate,
  }
}

export const animationEndLayout = (
  layout: Layout,
  animation: Animation
): Layout => {
  return pipe(
    layout,
    (l) => (animation.move === null ? l : relocLayout(l, animation.move.move)),
    (l) =>
      animation.zoom === null
        ? l
        : zoomLayout(l, animation.zoom.svg, animation.zoom.svgScale),
    (l) =>
      animation.rotate === null ? l : rotateLayout(l, animation.rotate.deg)
  )
}

const zoomToScale = (z: number): number =>
  Math.pow(svgMapViewerConfig.zoomFactor, z)
