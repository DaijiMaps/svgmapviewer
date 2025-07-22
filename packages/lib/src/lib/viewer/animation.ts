import { pipe } from 'fp-ts/lib/function'
import { svgMapViewerConfig } from '../../config'
import { boxCenter, boxScaleAt } from '../box/prefixed'
import { matrixMultiply, matrixScaleAt } from '../matrix/prefixed'
import { vecAdd, type VecVec as Vec } from '../vec/prefixed'
import type { Animation } from './animation-types'
import { fromMatrixSvg } from './coord'
import { relocLayout, zoomLayout, type Layout } from './layout'
import { fromTransform, invMove, invScale, transformScale } from './transform'

export const animationZoom = (
  layout: Layout,
  z: number,
  cursor: Vec
): Animation => {
  const osvg = fromMatrixSvg(layout).inverse().transformPoint(cursor)
  const s = 1 / zoomToScale(z)
  const q = matrixScaleAt([1 / s, 1 / s], [cursor.x, cursor.y])
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

  const s = nextLayout.svgScale.s / layout.svgScale.s
  const m2 = fromTransform(invScale({ s }))

  const c = boxCenter(layout.container)
  const m3 = fromTransform(c)

  const q = [m3, m2, m1].reduce(matrixMultiply)

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
        : zoomLayout(l, animation.zoom.svg, animation.zoom.svgScale)
    // XXX rotate
  )
}

const zoomToScale = (z: number): number =>
  Math.pow(svgMapViewerConfig.zoomFactor, z)
