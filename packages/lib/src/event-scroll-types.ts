/* eslint-disable functional/no-return-void */
import type { BoxBox } from './lib/box/prefixed'
import type { Cb } from './lib/cb'
import type { Scroll } from './types'

export type ScrollCb = (scroll: Readonly<Scroll>) => void
export type ScrollEventCb = (
  ev: Readonly<React.UIEvent<HTMLDivElement, Event>>
) => void
export type ScrollPosCb = (pos: Readonly<BoxBox>) => void

export interface ScrollCbs {
  eventTick: Set<ScrollEventCb>
  eventExpire: Set<Cb>
  get: Set<Cb>
  getDone: Set<ScrollCb>
  sync: Set<ScrollPosCb>
  syncSync: Set<ScrollPosCb>
  syncSyncDone: Set<ScrollCb>
}
