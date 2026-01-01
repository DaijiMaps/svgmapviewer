import { pipe } from 'fp-ts/function'
import { svgMapViewerConfig } from '../../../config'
import type { AnimationMatrix, Dir } from '../../../types'
import { boxCenter, boxScaleAt } from '../../box/prefixed'
import { type VecVec as Vec } from '../../vec/prefixed'
import {
  type Animation,
  type AnimationMove,
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
  const zoom = {
    svg: boxScaleAt(layout.svg, s, osvg.x, osvg.y),
    svgScale: transformScale(layout.svgScale, s),
    q,
    o,
  }
  return {
    move: null,
    zoom,
    rotate: null,
  }
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

  const zoom = {
    svg: nextLayout.svg,
    svgScale: nextLayout.svgScale,
    q,
    o: null,
  }

  return {
    move: null,
    zoom,
    rotate: null,
  }
}

export function animationRotate(
  _layout: Layout,
  deg: number,
  o: Vec
): Animation {
  const q = new DOMMatrixReadOnly().rotate(deg)

  const rotate = {
    deg,
    q,
    o,
  }

  return {
    move: null,
    zoom: null,
    rotate,
  }
}

function animationMoveDone(
  layout: Layout,
  move: null | Readonly<AnimationMove>
): Layout {
  return move === null ? layout : relocLayout(layout, move.move)
}

function animationZoomDone(
  layout: Layout,
  zoom: null | Readonly<AnimationZoom>
): Layout {
  return zoom === null ? layout : zoomLayout(layout, zoom.svg, zoom.svgScale)
}

function animationRotateDone(
  layout: Layout,
  rotate: null | Readonly<AnimationRotate>
): Layout {
  return rotate === null ? layout : rotateLayout(layout, rotate.deg)
}

export function animationEndLayout(
  layout: Layout,
  animation: Animation
): Layout {
  return pipe(
    layout,
    (l) => animationMoveDone(l, animation.move),
    (l) => animationZoomDone(l, animation.zoom),
    (l) => animationRotateDone(l, animation.rotate)
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
