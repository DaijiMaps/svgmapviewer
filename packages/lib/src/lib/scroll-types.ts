import { type BoxBox as Box, type BoxBox } from './box/prefixed'

type ScrollGet = {
  type: 'GET'
}
type ScrollEventSync = {
  type: 'SYNC'
  pos: Box
}
type ScrollEventSyncSync = {
  type: 'SYNCSYNC'
  pos: Box
}

export type ScrollEvent = ScrollGet | ScrollEventSync | ScrollEventSyncSync

export type SlideDone = { type: 'SCROLL.SLIDE.DONE' }
export type GetDone = { type: 'SCROLL.GET.DONE'; scroll: null | BoxBox }
export type SyncSyncDone = {
  type: 'SCROLL.SYNCSYNC.DONE'
  scroll: null | BoxBox
}
export type ScrollEmitted = SlideDone | GetDone | SyncSyncDone

export interface ScrollContext {
  dest: null | Box
  scroll: null | Box
}
