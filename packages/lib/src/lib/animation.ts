import { pipe } from 'fp-ts/lib/function'
//import { type Readonly } from 'type-fest'
import { type Box } from './box'
import { boxCenter, boxScaleAt } from './box/prefixed'
import { fromMatrixSvg, toMatrixSvg } from './coord'
import { type Drag } from './drag'
import { type Layout, relocLayout, zoomLayout } from './layout'
import {
  type MatrixMatrix as Matrix,
  matrixMultiply,
  matrixScaleAt,
} from './matrix/prefixed'
import {
  fromTransform,
  invMove,
  invScale,
  type Scale,
  transformPoint,
  transformScale,
} from './transform'
import { ifNullOr, zoomToScale } from './utils'
import { type VecVec as Vec, vecAdd, vecSub } from './vec/prefixed'

export type AnimationMove = Readonly<{
  move: Vec
  q: Matrix
}>

export type AnimationZoom = Readonly<{
  svg: Box
  svgScale: Scale
  q: Matrix
}>

export type Animation = Readonly<{
  move: null | AnimationMove
  zoom: null | AnimationZoom
}>

export const animationMove = (
  layout: Layout,
  drag: Drag,
  d: Vec
): Animation => {
  const move = vecAdd(drag.start, d)

  const v = vecSub(ifNullOr(move, layout.scroll), layout.scroll)
  const q = fromTransform(v)

  return {
    move: { move, q },
    zoom: null,
  }
}

export const animationZoom = (
  layout: Layout,
  z: number,
  cursor: Vec
): Animation => {
  const osvg = transformPoint(toMatrixSvg(layout), cursor)
  const s = 1 / zoomToScale(z)
  const q = matrixScaleAt([1 / s, 1 / s], [cursor.x, cursor.y])

  return {
    move: null,
    zoom: {
      svg: boxScaleAt(layout.svg, s, osvg.x, osvg.y),
      svgScale: transformScale(layout.svgScale, s),
      q,
    },
  }
}

export const animationHome = (
  layout: Layout,
  nextLayout: Layout
): Animation => {
  const osvg = boxCenter(nextLayout.config.svg)
  const o = pipe(osvg, (p) => transformPoint(fromMatrixSvg(layout), p))
  const m1 = fromTransform(invMove(o))

  const s = nextLayout.svgScale.s / layout.svgScale.s
  const m2 = fromTransform(invScale({ s }))

  const c = boxCenter(layout.container)
  const m3 = fromTransform(c)

  const q = [m3, m2, m1].reduce(matrixMultiply)

  return {
    move: null,
    zoom: {
      svg: nextLayout.svg,
      svgScale: nextLayout.svgScale,
      q,
    },
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
  )
}
