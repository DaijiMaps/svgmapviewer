/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { Scroll } from '../types'
import type { BoxBox } from './box/prefixed'
import type { ScrollCbs } from './event-scroll-types'

import { notifyCbs, notifyCbs0 } from './cb'

export const scrollCbs: ScrollCbs = {
  eventTick: new Set(),
  eventExpire: new Set(),
  get: new Set(),
  getDone: new Set(),
  sync: new Set(),
  syncSync: new Set(),
  syncSyncDone: new Set(),
}

export const notifyScroll = {
  eventTick: (ev: Readonly<React.UIEvent<HTMLDivElement, Event>>): void =>
    notifyCbs(scrollCbs.eventTick, ev),
  eventExpire: (): void => notifyCbs0(scrollCbs.eventExpire),
  get: (): void => notifyCbs0(scrollCbs.get),
  getDone: (scroll: Readonly<Scroll>): void =>
    notifyCbs(scrollCbs.getDone, scroll),
  sync: (pos: Readonly<BoxBox>): void => notifyCbs(scrollCbs.sync, pos),
  syncSync: (pos: Readonly<BoxBox>): void => notifyCbs(scrollCbs.syncSync, pos),
  syncSyncDone: (scroll: Readonly<Scroll>): void =>
    notifyCbs(scrollCbs.syncSyncDone, scroll),
}
