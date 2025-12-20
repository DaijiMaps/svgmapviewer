import type { Scroll } from '../../types'
import { type BoxBox } from '../box/prefixed'

type ScrollGet = {
  type: 'GET'
}
type ScrollEventSync = {
  type: 'SYNC'
  pos: BoxBox
}
type ScrollEventSyncSync = {
  type: 'SYNCSYNC'
  pos: BoxBox
}

export type ScrollEvent = ScrollGet | ScrollEventSync | ScrollEventSyncSync

////

export type ScrollGetDone = { type: 'SCROLL.GET.DONE'; scroll: Scroll }
export type ScrollSyncSyncDone = {
  type: 'SCROLL.SYNCSYNC.DONE'
  scroll: Scroll
}
export type ScrollEmitted = ScrollGetDone | ScrollSyncSyncDone

////

export interface ScrollContext {
  dest: Scroll
  scroll: Scroll
}
