import type { AnimationMatrix, Dir } from '../../../types'

import { svgMapViewerConfig } from '../../../config'
import { boxCenter, boxScaleAt } from '../../box/prefixed'
import { type VecVec as Vec } from '../../vec/prefixed'
import {
  type Animation,
  type AnimationMove,
  type AnimationReq,
  type AnimationRotate,
  type AnimationZoom,
} from './animation-types'
import { fromMatrixSvg } from './coord'
import {
  relocLayout,
  resetLayout,
  rotateLayout,
  zoomLayout,
  type Layout,
} from './layout'
import { transformScale } from './transform'

export function calcAnimation(
  req: null | AnimationReq,
  layout: Layout
): null | Animation {
  return req === null
    ? null
    : req.type === 'zoom'
      ? animationZoom(layout, req.z, req.p)
      : req.type === 'home'
        ? animationHome(layout, resetLayout(layout))
        : //animationReq.type === 'rotate'
          animationRotate(layout, 90, req.p)
}

export function calcAnimationZoom(req: null | AnimationReq): number {
  return req === null || req.type !== 'zoom' ? 1 : Math.pow(2, req.z)
}

export function calcAnimationRotate(req: null | AnimationReq): number {
  return req === null || req.type !== 'rotate' ? 0 : req.deg
}

////

function animationMoveDone(
  layout: Layout,
  move: Readonly<AnimationMove>
): Layout {
  return relocLayout(layout, move.move)
}

////

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

function animationZoomDone(
  layout: Layout,
  zoom: Readonly<AnimationZoom>
): Layout {
  return zoomLayout(layout, zoom.svg, zoom.svgScale)
}

////

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

function animationRotateDone(
  layout: Layout,
  rotate: Readonly<AnimationRotate>
): Layout {
  return rotateLayout(layout, rotate.deg)
}

////

export function animationDone(layout: Layout, a: null | Animation): Layout {
  return a === null
    ? layout
    : a.type === 'Move'
      ? animationMoveDone(layout, a)
      : a.type === 'Zoom'
        ? animationZoomDone(layout, a)
        : animationRotateDone(layout, a)
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
