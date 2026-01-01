import {
  type Dir,
  type SearchData,
  type SearchReq,
  type SearchRes,
} from '../../types'
import { type BoxBox } from '../box/prefixed'
import { type VecVec as Vec, type VecVec } from '../vec/prefixed'
import { type Animation } from './layout/animation-types'
import { type Layout } from './layout/layout'

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

type WantAnimation = null | 'zoom' | 'rotate'

//// context

export type ViewerContext = {
  origLayout: Layout
  layout: Layout
  prevLayout: null | Layout
  cursor: Vec
  z: null | Dir
  zoom: number
  want_animation: WantAnimation
  animation: null | Animation

  mode: ViewerMode

  homing: boolean
  animating: boolean // XXX
  rendered: boolean
}

//// external event (request)

export type ResizeRequest = { type: 'RESIZE'; layout: Layout; force: boolean }
export type LayoutResetRequest = { type: 'LAYOUT.RESET' }
export type SwitchRequest = { type: 'SWITCH'; fidx: number }
export type SwitchDoneRequest = { type: 'SWITCH.DONE' }
export type RotateRequest = { type: 'ROTATE' }
export type RecenterRequest = { type: 'RECENTER' }
export type RenderedRequest = { type: 'RENDERED' }
export type AnimationEndRequest = { type: 'ANIMATION.END' }
export type ScrollGetDoneRequest = { type: 'SCROLL.GET.DONE'; scroll: BoxBox }
export type ScrollSyncsyncDoneRequest = {
  type: 'SCROLL.SYNCSYNC.DONE'
  scroll: BoxBox
}
export type TouchLockRequest = { type: 'TOUCH.LOCK' }
export type TouchUnlockRequest = { type: 'TOUCH.UNLOCK' }
export type ZoomRequest = { type: 'ZOOM.ZOOM'; z: Dir; p: null | VecVec }
export type SearchEnd = { type: 'SEARCH.END'; res: Readonly<null | SearchRes> }
export type Searchlock = { type: 'SEARCH.LOCK'; psvg: Vec }
export type SearchUnlock = { type: 'SEARCH.UNLOCK' }
export type ViewerRequest =
  | ResizeRequest
  | LayoutResetRequest
  | SwitchRequest
  | SwitchDoneRequest
  | RotateRequest
  | RecenterRequest
  | RenderedRequest
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

export type UIEvent = ReactUIEvent

//// all event

export type ViewerEvent = ViewerRequest | ViewerMessage | UIEvent

//// emitted

export type SearchEmitted = { type: 'SEARCH'; req: SearchReq }
export type SearchEndDoneEmitted = {
  type: 'SEARCH.END.DONE'
  res: null | SearchData
}
export type LockEmitted = { type: 'LOCK'; ok: boolean }
export type LayoutEmitted = { type: 'LAYOUT'; layout: Layout }
export type ZoomStartEmitted = {
  type: 'ZOOM.START'
  layout: Layout
  zoom: number
  z: Dir
}
export type ZoomEndEmitted = { type: 'ZOOM.END'; layout: Layout; zoom: number }
export type ModeEmitted = { type: 'MODE'; mode: ViewerMode }

export type SyncAnimationEmitted = {
  type: 'SYNC.ANIMATION'
  animation: null | Animation
}
export type SyncLayoutEmitted = {
  type: 'SYNC.LAYOUT'
  layout: Readonly<Layout>
  force: boolean
}

export type ScrollSyncEmitted = { type: 'SCROLL.SYNC'; pos: Readonly<BoxBox> }
export type ScrollSyncSyncEmitted = {
  type: 'SCROLL.SYNCSYNC'
  pos: Readonly<BoxBox>
}
export type ScrollGetEmitted = { type: 'SCROLL.GET' }

export type ViewerEmitted =
  | SearchEmitted
  | SearchEndDoneEmitted
  | LockEmitted
  | LayoutEmitted
  | ZoomStartEmitted
  | ZoomEndEmitted
  | ModeEmitted
  | SwitchRequest
  | SwitchDoneRequest
  | SyncAnimationEmitted
  | SyncLayoutEmitted
  | ScrollSyncEmitted
  | ScrollSyncSyncEmitted
  | ScrollGetEmitted
