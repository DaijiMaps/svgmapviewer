import React from 'react'
import { type Animation } from './animation'
import { type BoxBox } from './box/prefixed'
import { type Layout } from './layout'
import { type Info, type SearchRes } from './types'
import { type VecVec as Vec, type VecVec } from './vec/prefixed'

export const EXPAND_PANNING = 9

//// mode

export type ViewerModePanning = 'panning'
export type ViewerModeTouching = 'touching'
export type ViewerModeLocked = 'locked'
export type ViewerMode =
  | ViewerModePanning
  | ViewerModeTouching
  | ViewerModeLocked
export const viewerModePanning: ViewerModePanning = 'panning'
export const viewerModeTouching: ViewerModeTouching = 'touching'
export const viewerModeLocked: ViewerModeLocked = 'locked'

//// context

export type ViewerContext = {
  origLayout: Layout
  layout: Layout
  nextLayout: null | Layout
  cursor: Vec
  z: null | number
  zoom: number
  animation: null | Animation

  mode: ViewerMode
  touching: boolean

  homing: boolean
  animating: boolean // XXX
  rendered: boolean
  mapHtmlRendered: boolean
  mapSvgRendered: boolean
}

//// external event (request)

export type ResizeRequest = { type: 'RESIZE'; layout: Layout; force: boolean }
export type LayoutResetRequest = { type: 'LAYOUT.RESET' }
export type RecenterRequest = { type: 'RECENTER' }
export type RenderedRequest = { type: 'RENDERED' }
export type RenderedMapHtmlRequest = { type: 'RENDERED.MAP-HTML' }
export type RenderedMapSvgRequest = { type: 'RENDERED.MAP-SVG' }
export type AnimationEndRequest = { type: 'ANIMATION.END' }
export type ScrollGetDoneRequest = { type: 'SCROLL.GET.DONE'; scroll: BoxBox }
export type ScrollSyncsyncDoneRequest = {
  type: 'SCROLL.SYNCSYNC.DONE'
  scroll: BoxBox
}
export type TouchLockRequest = { type: 'TOUCH.LOCK' }
export type TouchUnlockRequest = { type: 'TOUCH.UNLOCK' }
export type ZoomRequest = { type: 'ZOOM.ZOOM'; z: -1 | 1; p: null | VecVec }
export type SearchEnd = { type: 'SEARCH.END'; res: Readonly<SearchRes> }
export type Searchlock = { type: 'SEARCH.LOCK'; psvg: Vec }
export type SearchUnlock = { type: 'SEARCH.UNLOCK' }
export type ViewerRequest =
  | ResizeRequest
  | LayoutResetRequest
  | RecenterRequest
  | RenderedRequest
  | RenderedMapHtmlRequest
  | RenderedMapSvgRequest
  | ScrollGetDoneRequest
  | ScrollSyncsyncDoneRequest
  | TouchLockRequest
  | TouchUnlockRequest
  | ZoomRequest
  | SearchEnd
  | Searchlock
  | SearchUnlock

//// internal message (raise)

export type ViewerMessage =
  | { type: 'TOUCHING' }
  | { type: 'TOUCHING.DONE' }
  | { type: 'SEARCH.DONE' }

//// UI event

export type UIEventClick = {
  type: 'CLICK'
  ev: React.MouseEvent<HTMLDivElement>
}
export type UIEventContextMenu = {
  type: 'CONTEXTMENU'
  ev: React.MouseEvent<HTMLDivElement>
}
export type UIEventKeyDown = { type: 'KEY.DOWN'; ev: KeyboardEvent }
export type UIEventKeyUp = { type: 'KEY.UP'; ev: KeyboardEvent }
export type UIEventWheel = {
  type: 'WHEEL'
  ev: React.WheelEvent<HTMLDivElement>
}
export type UIEventScroll = { type: 'SCROLL'; ev: Event | React.UIEvent }
export type UIEventAnimationEnd = {
  type: 'ANIMATION.END'
  ev: React.AnimationEvent<HTMLDivElement>
}

export type ReactUIEvent =
  | UIEventAnimationEnd
  | UIEventClick
  | UIEventContextMenu
  | UIEventScroll
  | UIEventWheel

export type RawUIEvent = UIEventKeyDown | UIEventKeyUp

export type UIEvent = RawUIEvent | ReactUIEvent

//// all event

export type ViewerEvent = ViewerRequest | ViewerMessage | UIEvent

//// emitted

export type SearchEmitted = { type: 'SEARCH'; psvg: Vec }
export type SearchEndDoneEmitted = {
  type: 'SEARCH.END.DONE'
  psvg: Vec
  info: Info
  layout: Layout
}
export type LockEmitted = { type: 'LOCK'; ok: boolean }
export type LayoutEmitted = { type: 'LAYOUT'; layout: Layout }
export type ZoomStartEmitted = {
  type: 'ZOOM.START'
  layout: Layout
  zoom: number
  z: number
}
export type ZoomEndEmitted = { type: 'ZOOM.END'; layout: Layout; zoom: number }
export type ModeEmitted = { type: 'MODE'; mode: ViewerMode }

export type ViewerEmitted =
  | SearchEmitted
  | SearchEndDoneEmitted
  | LockEmitted
  | LayoutEmitted
  | ZoomStartEmitted
  | ZoomEndEmitted
  | ModeEmitted
