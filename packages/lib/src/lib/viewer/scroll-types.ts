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

export type GetDone = { type: 'SCROLL.GET.DONE'; scroll: Scroll }
export type SyncSyncDone = {
  type: 'SCROLL.SYNCSYNC.DONE'
  scroll: Scroll
}
export type ScrollEmitted = GetDone | SyncSyncDone

export interface ScrollContext {
  dest: Scroll
  scroll: Scroll
}
