import { pipe } from 'fp-ts/lib/function'
import { ReadonlyDeep } from 'type-fest'
import { Box } from './box'
import { boxCenter, boxMove, boxScaleAt } from './box/prefixed'
import { fromMatrixSvg, toMatrixOuter, toMatrixSvg } from './coord'
import { Drag } from './drag'
import { Layout, relocLayout, zoomLayout } from './layout'
import {
  MatrixMatrix as Matrix,
  matrixMultiply,
  matrixScaleAt,
} from './matrix/prefixed'
import {
  fromTransform,
  invMove,
  invScale,
  Scale,
  transformPoint,
  transformScale,
} from './transform'
import { ifNullOr, zoomToScale } from './utils'
import { VecVec as Vec, vecSub } from './vec/prefixed'

export type AnimationMove = Readonly<{
  move: Box
  q: Matrix
}>

export type AnimationZoom = ReadonlyDeep<{
  svg: Box
  svgScale: Scale
  q: Matrix
}>

export type Animation = ReadonlyDeep<{
  move: null | AnimationMove
  zoom: null | AnimationZoom
}>

export const animationMove = (
  layout: Layout,
  drag: Drag,
  d: Vec
): Animation => {
  const move = boxMove(drag.start, d)

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
  //const o = transformPoint(toMatrixOuter(layout), cursor)
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
  const o = pipe(
    osvg,
    (p) => transformPoint(fromMatrixSvg(layout), p),
    (p) => transformPoint(toMatrixOuter(layout), p)
  )
  const m1 = fromTransform(invMove(o))

  const s = nextLayout.svgScale.s / layout.svgScale.s
  const m2 = fromTransform(invScale({ s }))

  const c = pipe(boxCenter(layout.container), (p) =>
    transformPoint(toMatrixOuter(layout), p)
  )
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
