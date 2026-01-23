/* eslint-disable functional/no-return-void */
import type { Scroll } from '../types'
import type { BoxBox } from './box/prefixed'
import type { Cb } from './cb'

export type ScrollCb = (scroll: Readonly<Scroll>) => void
export type ScrollEventCb = (
  ev: Readonly<React.UIEvent<HTMLDivElement, Event>>
) => void
export type ScrollPosCb = (pos: Readonly<BoxBox>) => void

export interface ScrollCbs {
  readonly eventTick: Set<ScrollEventCb>
  readonly eventExpire: Set<Cb>
  readonly get: Set<Cb>
  readonly getDone: Set<ScrollCb>
  readonly sync: Set<ScrollPosCb>
  readonly syncSync: Set<ScrollPosCb>
  readonly syncSyncDone: Set<ScrollCb>
}
