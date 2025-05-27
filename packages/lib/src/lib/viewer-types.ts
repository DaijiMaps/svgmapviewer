import React from 'react'
import { type Animation } from './animation'
import { type BoxBox } from './box/prefixed'
import { type Layout } from './layout'
import { type Info, type SearchRes } from './types'
import { type VecVec as Vec, type VecVec } from './vec/prefixed'

export const EXPAND_PANNING = 9

export type PointerModePanning = 'panning'
export type PointerModeTouching = 'touching'
export type PointerModeLocked = 'locked'
export type ViewerMode =
  | PointerModePanning
  | PointerModeTouching
  | PointerModeLocked
export const viewerModePanning: PointerModePanning = 'panning'
export const viewerModeTouching: PointerModeTouching = 'touching'
export const viewerModeLocked: PointerModeLocked = 'locked'

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
}

export type PointerExternalEvent =
  | { type: 'RESIZE'; layout: Layout; force: boolean }
  | { type: 'LAYOUT.RESET' }
  | { type: 'RENDERED' }
  | { type: 'RENDERED.MAP-HTML' }
  | { type: 'ANIMATION.END' }
  | { type: 'SCROLL.GET.DONE'; scroll: BoxBox }
  | { type: 'SCROLL.SYNCSYNC.DONE'; scroll: BoxBox }
  | { type: 'TOUCH.LOCK' }
  | { type: 'TOUCH.UNLOCK' }
  | { type: 'ZOOM.ZOOM'; z: -1 | 1; p: null | VecVec }

export type PointerEventSearch =
  | { type: 'SEARCH.END'; res: Readonly<SearchRes> }
  | { type: 'SEARCH.LOCK'; psvg: Vec }
  | { type: 'SEARCH.UNLOCK' }

export type PointerEventTouching =
  | { type: 'TOUCHING' }
  | { type: 'TOUCHING.DONE' }

export type PointerInternalEvent =
  | PointerEventSearch
  | PointerEventTouching
  | { type: 'SEARCH.DONE' }

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

export type ViewerEvent = PointerExternalEvent | PointerInternalEvent | UIEvent

export type ViewerEmitted =
  | { type: 'SEARCH'; psvg: Vec }
  | {
      type: 'SEARCH.END.DONE'
      psvg: Vec
      info: Info
      layout: Layout
    }
  | { type: 'LOCK'; ok: boolean }
  | { type: 'LAYOUT'; layout: Layout }
  | { type: 'ZOOM.START'; layout: Layout; zoom: number; z: number }
  | { type: 'ZOOM.END'; layout: Layout; zoom: number }
  | { type: 'MODE'; mode: ViewerMode }
