import { pipe } from 'fp-ts/function'
import { svgMapViewerConfig } from '../../../config'
import type { AnimationMatrix, Dir } from '../../../types'
import { boxCenter, boxScaleAt } from '../../box/prefixed'
import { type VecVec as Vec } from '../../vec/prefixed'
import {
  type Animation,
  type AnimationRotate,
  type AnimationZoom,
} from './animation-types'
import { fromMatrixSvg } from './coord'
import { relocLayout, rotateLayout, zoomLayout, type Layout } from './layout'
import { transformScale } from './transform'

export function animationZoom(layout: Layout, z: Dir, o: Vec): Animation {
  const osvg = fromMatrixSvg(layout).inverse().transformPoint(o)
  const s = 1 / zoomToScale(z)
  const q = new DOMMatrixReadOnly().scale(1 / s, 1 / s)
  const zoom: AnimationZoom = {
    type: 'Zoom',
    svg: boxScaleAt(layout.svg, s, osvg.x, osvg.y),
    svgScale: transformScale(layout.svgScale, s),
    q,
    o,
  }
  return zoom
}

export function animationHome(layout: Layout, nextLayout: Layout): Animation {
  const osvg = boxCenter(nextLayout.config.svg)
  const msvg = fromMatrixSvg(layout)
  const o = msvg.transformPoint(osvg)

  const s = nextLayout.svgScale.s / layout.svgScale.s

  const c = boxCenter(layout.container)

  const q = new DOMMatrixReadOnly()
    .translate(c.x, c.y)
    .scale(1 / s)
    .translate(-o.x, -o.y)

  const zoom: AnimationZoom = {
    type: 'Zoom',
    svg: nextLayout.svg,
    svgScale: nextLayout.svgScale,
    q,
    o: null,
  }

  return zoom
}

export function animationRotate(
  _layout: Layout,
  deg: number,
  o: Vec
): Animation {
  const q = new DOMMatrixReadOnly().rotate(deg)

  const rotate: AnimationRotate = {
    type: 'Rotate',
    deg,
    q,
    o,
  }

  return rotate
}

function animationMoveDone(
  layout: Layout,
  move: null | Readonly<Animation>
): Layout {
  return move === null || move.type !== 'Move'
    ? layout
    : relocLayout(layout, move.move)
}

function animationZoomDone(
  layout: Layout,
  zoom: null | Readonly<Animation>
): Layout {
  return zoom === null || zoom.type !== 'Zoom'
    ? layout
    : zoomLayout(layout, zoom.svg, zoom.svgScale)
}

function animationRotateDone(
  layout: Layout,
  rotate: null | Readonly<Animation>
): Layout {
  return rotate === null || rotate.type !== 'Rotate'
    ? layout
    : rotateLayout(layout, rotate.deg)
}

export function animationEndLayout(
  layout: Layout,
  animation: Animation
): Layout {
  return pipe(
    layout,
    (l) => animationMoveDone(l, animation),
    (l) => animationZoomDone(l, animation),
    (l) => animationRotateDone(l, animation)
  )
}

function zoomToScale(z: Dir): number {
  return Math.pow(svgMapViewerConfig.zoomFactor, z)
}

////

export function animationStyle(a: null | Readonly<AnimationMatrix>): string {
  const style = a === null ? '' : css(a)
  return style
}

function css({ matrix: q, origin: o }: Readonly<AnimationMatrix>): string {
  const p = new DOMMatrixReadOnly()
  return `
#viewer {
  will-change: transform;
  animation: container-zoom 500ms ease;
}
@keyframes container-zoom {
  from {
    transform-origin: ${o === null ? `left top` : `${o.x}px ${o.y}px`};
    transform: ${p.toString()} translate3d(0px, 0px, 0px);
  }
  to {
    transform-origin: ${o === null ? `left top` : `${o.x}px ${o.y}px`};
    transform: ${q.toString()} translate3d(0px, 0px, 0px);
  }
}
`
}
