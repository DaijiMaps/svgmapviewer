import type { SearchSvgReq } from '../../types'
import { boxCenter } from '../box/prefixed'
import {
  animationDone,
  calcAnimation,
  calcAnimationRotate,
  calcAnimationZoom,
} from './layout/animation'
import { fromMatrixSvg } from './layout/coord'
import {
  expandLayoutCenter,
  rotateLayout,
  scrollLayout,
  type Layout,
} from './layout/layout'
import { getCurrentScroll } from './scroll/scroll'
import {
  EXPAND_PANNING,
  type SearchEnd,
  type ViewerContext,
  type ViewerEmitted,
} from './viewer-types'

// resize

export function resizeLayout(
  context: ViewerContext,
  layout: Layout
): ViewerContext {
  return {
    ...context,
    rendered: false,
    origLayout: layout,
    layout: expandLayoutCenter(layout, EXPAND_PANNING),
  }
}

export function resetScroll(context: ViewerContext): ViewerContext {
  const { scroll } = getCurrentScroll()
  const layout = scrollLayout(context.layout, scroll)
  return {
    ...context,
    layout,
  }
}

// zoom and home

export function startZoom(context: ViewerContext): ViewerContext {
  const animation = calcAnimation(context.animationReq, context.layout)
  const prevLayout = context.layout
  const layout = animationDone(context.layout, animation)
  return { ...context, animation, prevLayout, layout }
}

export function endZoom(context: ViewerContext): ViewerContext {
  const zoom = context.zoom * calcAnimationZoom(context.animationReq)
  const rotate = context.rotate + calcAnimationRotate(context.animationReq)
  return {
    ...context,
    prevLayout: null,
    //animationReq: null,
    animation: null,
    zoom,
    rotate,
  }
}

export function endHome(context: ViewerContext): ViewerContext {
  const cursor = boxCenter(context.origLayout.container)
  const layout = rotateLayout(
    expandLayoutCenter(context.origLayout, EXPAND_PANNING),
    context.rotate
  )
  return {
    ...context,
    cursor,
    layout,
  }
}

// search

export function searchStart(context: ViewerContext): ViewerEmitted {
  const { scroll } = getCurrentScroll()
  const l = scrollLayout(context.layout, scroll)
  const m = fromMatrixSvg(l).inverse()
  const psvg = m.transformPoint(context.cursor)
  const req: SearchSvgReq = { psvg }
  return { type: 'SEARCH.START', req }
}

export function searchEnd(
  context: ViewerContext,
  params: Readonly<SearchEnd>
): ViewerEmitted {
  const { res } = params
  const { scroll } = getCurrentScroll()
  const layout = scrollLayout(context.layout, scroll)
  return {
    type: 'SEARCH.END.DONE',
    res: res === null ? null : { ...res, layout },
  }
}
