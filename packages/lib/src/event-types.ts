/* eslint-disable functional/no-return-void */
import { type BoxBox } from './lib/box/prefixed'
import { type Vec } from './lib/vec'
import { type ViewerMode } from './lib/viewer/viewer-types'
import { type Cb, type Cb1 } from './lib/cb'
import type {
  AnimationMatrix,
  ResizeInfo,
  Scroll,
  SearchData,
  SearchReq,
  SearchRes,
  SvgMapViewerConfig,
  ZoomEndInfo,
  ZoomInfo,
} from './types'

export type InitCb = Cb1<Readonly<SvgMapViewerConfig>>
export type ScrollEventCb = (
  ev: Readonly<React.UIEvent<HTMLDivElement, Event>>
) => void
export type ScrollCb = (scroll: Readonly<Scroll>) => void
export type ScrollPosCb = (pos: Readonly<BoxBox>) => void
export type ZoomStartCb = Cb1<Readonly<ZoomInfo>>
export type ZoomEndCb = Cb1<Readonly<ZoomEndInfo>>
export type SearchStartCb = Cb1<Readonly<SearchReq>>
export type SearchCb = Cb1<Readonly<SearchReq>>
export type SearchDoneCb = Cb1<Readonly<null | SearchRes>>
export type SearchEndCb = Cb1<Readonly<null | SearchRes>>
export type SearchEndDoneCb = Cb1<Readonly<SearchData>>
export type UiOpenCb = Cb1<Vec>
export type UiOpenDoneCb = Cb1<boolean>
export type UiCloseCb = Cb
export type UiCloseDoneCb = () => void
export type ResizeCb = Cb1<Readonly<ResizeInfo>>
export type LayoutCb = Cb1<Readonly<ResizeInfo>>
export type AnimationCb = Cb1<Readonly<null | AnimationMatrix>>
export type ModeCb = Cb1<ViewerMode>
export type FloorCb = Cb1<number>

export type TouchZoomCbArgs = { z: number; p: null | Vec }
export type TouchZoomCb = Cb1<TouchZoomCbArgs>

export interface ScrollCbs {
  eventTick: Set<ScrollEventCb>
  eventExpire: Set<Cb>
  get: Set<Cb>
  getDone: Set<ScrollCb>
  sync: Set<ScrollPosCb>
  syncSync: Set<ScrollPosCb>
  syncSyncDone: Set<ScrollCb>
}

export interface StyleCbs {
  resize: Set<ResizeCb>
  layout: Set<LayoutCb>
  zoomStart: Set<ZoomStartCb>
  zoomEnd: Set<ZoomEndCb>
  animation: Set<AnimationCb>
  mode: Set<ModeCb>
}

export interface SearchCbs {
  start: Set<SearchStartCb>
  request: Set<SearchCb>
  requestDone: Set<SearchDoneCb>
  end: Set<SearchEndCb>
  endDone: Set<SearchEndDoneCb>
}

export interface UiCbs {
  open: Set<UiOpenCb>
  openDone: Set<UiOpenDoneCb>
  close: Set<UiCloseCb>
  closeDone: Set<UiCloseDoneCb>
}

export interface FloorCbs {
  lock: Set<FloorCb>
  select: Set<FloorCb>
  selectDone: Set<FloorCb>
  unlock: Set<Cb>
}

export interface TouchCbs {
  multiStart: Set<Cb>
  multiEnd: Set<Cb>
  zoom: Set<TouchZoomCb>
}

export interface ActionCbs {
  zoomIn: Set<Cb>
  zoomOut: Set<Cb>
  reset: Set<Cb>
  recenter: Set<Cb>
  rotate: Set<Cb>
  position: Set<Cb>
  fullscreen: Set<Cb>
}
