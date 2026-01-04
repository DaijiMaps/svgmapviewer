import {
  type Dir,
  type SearchData,
  type SearchSvgReq,
  type SearchRes,
  type Zoom,
} from '../../types'
import { type BoxBox } from '../box/prefixed'
import { type VecVec as Vec } from '../vec/prefixed'
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

type WantAnimation =
  | { type: 'zoom'; z: -1 | 1; p: Vec }
  | { type: 'home' }
  | { type: 'rotate'; deg: number; p: Vec }

//// context

export type ViewerContext = {
  origLayout: Layout
  layout: Layout
  prevLayout: null | Layout
  cursor: Vec
  zoom: number
  wantAnimation: null | WantAnimation
  animation: null | Animation

  rendered: boolean
}

//// external event (request)

export type ResizeRequest = { type: 'RESIZE'; layout: Layout; force: boolean }
export type SwitchRequest = { type: 'SWITCH'; fidx: number }
export type SwitchDoneRequest = { type: 'SWITCH.DONE' }
export type HomeRequest = { type: 'HOME' }
export type RotateRequest = { type: 'ROTATE' }
export type RecenterRequest = { type: 'RECENTER' }
export type RenderedRequest = { type: 'RENDERED' }
export type AnimationEndRequest = { type: 'ANIMATION.END' }
export type ScrollGetDoneRequest = { type: 'SCROLL.GET.DONE'; scroll: BoxBox }
export type ScrollSyncsyncDoneRequest = {
  type: 'SCROLL.SYNCSYNC.DONE'
  scroll: BoxBox
}
export type ZoomRequest = { type: 'ZOOM' } & Zoom
export type SearchRequest = { type: 'SEARCH'; pos: Vec }
export type SearchEnd = { type: 'SEARCH.END'; res: Readonly<null | SearchRes> }
export type ViewerRequest =
  | ResizeRequest
  | HomeRequest
  | SwitchRequest
  | SwitchDoneRequest
  | RotateRequest
  | RecenterRequest
  | RenderedRequest
  | ScrollGetDoneRequest
  | ScrollSyncsyncDoneRequest
  | ZoomRequest
  | SearchRequest
  | SearchEnd

//// internal message (raise)

export type ViewerMessage = { type: 'SEARCH.DONE' }

//// UI event

export type UIEventScroll = { type: 'SCROLL'; ev: Event | React.UIEvent }
export type UIEventAnimationEnd = {
  type: 'ANIMATION.END'
  ev: React.AnimationEvent<HTMLDivElement>
}

export type ReactUIEvent = UIEventAnimationEnd | UIEventScroll

export type UIEvent = ReactUIEvent

//// all event

export type ViewerEvent = ViewerRequest | ViewerMessage | UIEvent

//// emitted

export type SearchEmitted = { type: 'SEARCH.START'; req: SearchSvgReq }
export type SearchEndDoneEmitted = {
  type: 'SEARCH.END.DONE'
  res: null | SearchData
}
export type ZoomStartEmitted = {
  type: 'ZOOM.START'
  layout: Layout
  zoom: number
  z: Dir
}
export type ZoomEndEmitted = { type: 'ZOOM.END'; layout: Layout; zoom: number }

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
  | ZoomStartEmitted
  | ZoomEndEmitted
  | SwitchRequest
  | SwitchDoneRequest
  | SyncAnimationEmitted
  | SyncLayoutEmitted
  | ScrollSyncEmitted
  | ScrollSyncSyncEmitted
  | ScrollGetEmitted
