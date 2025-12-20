/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import type { ScrollCbs } from './event-scroll-types'
import type { BoxBox } from './lib/box/prefixed'
import { notifyCbs, notifyCbs0 } from './lib/cb'
import type { Scroll } from './types'

export const scrollCbs: ScrollCbs = {
  eventTick: new Set(),
  eventExpire: new Set(),
  get: new Set(),
  getDone: new Set(),
  sync: new Set(),
  syncSync: new Set(),
  syncSyncDone: new Set(),
}

export function notifyScrollEventTick(
  ev: Readonly<React.UIEvent<HTMLDivElement, Event>>
): void {
  notifyCbs(scrollCbs.eventTick, ev)
}
export function notifyScrollEventExpire(): void {
  notifyCbs0(scrollCbs.eventExpire)
}
export function notifyScrollGet(): void {
  notifyCbs0(scrollCbs.get)
}
export function notifyScrollGetDone(scroll: Readonly<Scroll>): void {
  notifyCbs(scrollCbs.getDone, scroll)
}
export function notifyScrollSync(pos: Readonly<BoxBox>): void {
  notifyCbs(scrollCbs.sync, pos)
}
export function notifyScrollSyncSync(pos: Readonly<BoxBox>): void {
  notifyCbs(scrollCbs.syncSync, pos)
}
export function notifyScrollSyncSyncDone(scroll: Readonly<Scroll>): void {
  notifyCbs(scrollCbs.syncSyncDone, scroll)
}
