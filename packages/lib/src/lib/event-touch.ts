/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { Zoom } from '../types'
import { notifyCbs, notifyCbs0 } from './cb'
import type { TouchCbs } from './event-touch-types'
import type { VecVec } from './vec/prefixed'

export const touchCbs: TouchCbs = {
  multiStart: new Set(),
  multiEnd: new Set(),
  zoom: new Set(),
}

export const notifyTouch = {
  multiStart: (): void => notifyCbs0(touchCbs.multiStart),
  multiEnd: (args: Readonly<{ p?: VecVec; s?: number }>): void =>
    notifyCbs(touchCbs.multiEnd, args),
  zoom: (args: Readonly<Zoom>): void => notifyCbs(touchCbs.zoom, args),
}
