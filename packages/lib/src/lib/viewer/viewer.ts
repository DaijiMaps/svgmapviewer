import type { SearchSvgReq } from '../../types'
import { boxCenter } from '../box/prefixed'
import {
  animationDone,
  calcAnimation,
  calcAnimationRotate,
  calcAnimationZoom,
} from './layout/animation'
import { fromMatrixSvg } from './layout/coord'
import { expandLayoutCenter, rotateLayout, scrollLayout } from './layout/layout'
import { getCurrentScroll } from './scroll/scroll'
import {
  EXPAND_PANNING,
  type ResizeRequest,
  type SearchEnd,
  type SwitchRequest,
  type ViewerContext,
  type ViewerEmitted,
} from './viewer-types'

// resize

export function resetCursor(context: ViewerContext): ViewerContext {
  const cursor = boxCenter(context.layout.container)
  return {
    ...context,
    cursor,
  }
}

export function resizeLayout(
  context: ViewerContext,
  { layout }: Readonly<ResizeRequest>
): ViewerContext {
  return {
    ...context,
    rendered: false,
    origLayout: layout,
    layout: expandLayoutCenter(layout, EXPAND_PANNING),
  }
}

export function emitSyncLayout({
  layout,
  rendered,
}: ViewerContext): ViewerEmitted {
  return {
    type: 'SYNC.LAYOUT',
    layout: layout,
    force: rendered,
  }
}

// scroll

export function resetScroll(context: ViewerContext): ViewerContext {
  const { scroll } = getCurrentScroll()
  const layout = scrollLayout(context.layout, scroll)
  return {
    ...context,
    layout,
  }
}

// eslint-disable-next-line functional/functional-parameters
export function emitGetScroll(): ViewerEmitted {
  return { type: 'SCROLL.GET' }
}

export function emitSyncScroll({ layout }: ViewerContext): ViewerEmitted {
  return {
    type: 'SCROLL.SYNC',
    pos: layout.scroll,
  }
}

export function emitSyncSyncScroll({ layout }: ViewerContext): ViewerEmitted {
  return {
    type: 'SCROLL.SYNCSYNC',
    pos: layout.scroll,
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

export function emitZoomStart({
  layout,
  zoom,
  animation,
}: ViewerContext): ViewerEmitted {
  return {
    type: 'ZOOM.START',
    layout,
    zoom,
    q: animation?.q ?? null,
  }
}

export function emitZoomEnd({
  layout,
  zoom,
  animation,
}: ViewerContext): ViewerEmitted {
  return {
    type: 'ZOOM.END',
    layout,
    zoom,
    q: animation?.q ?? null,
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

// switch

export function emitSwitch(
  _: ViewerContext,
  { fidx }: Readonly<SwitchRequest>
): ViewerEmitted {
  return { type: 'SWITCH', fidx }
}

// eslint-disable-next-line functional/functional-parameters
export function emitSwitchDone(): ViewerEmitted {
  return { type: 'SWITCH.DONE' }
}
