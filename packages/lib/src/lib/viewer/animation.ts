import { pipe } from 'fp-ts/function'
import { svgMapViewerConfig } from '../../config'
import type { Dir } from '../../types'
import { boxCenter, boxScaleAt } from '../box/prefixed'
import { type VecVec as Vec } from '../vec/prefixed'
import { type Animation } from './animation-types'
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

export function animationEndLayout(
  layout: Layout,
  animation: Animation
): Layout {
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

function zoomToScale(z: Dir): number {
  return Math.pow(svgMapViewerConfig.zoomFactor, z)
}
