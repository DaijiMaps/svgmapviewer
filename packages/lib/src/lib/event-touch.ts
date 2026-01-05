/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */

import type { Zoom } from '../types'
import type { TouchCbs } from './event-touch-types'

import { notifyCbs, notifyCbs0 } from './cb'

export const touchCbs: TouchCbs = {
  multiStart: new Set(),
  multiEnd: new Set(),
  zoom: new Set(),
}

export const notifyTouch = {
  multiStart: (): void => notifyCbs0(touchCbs.multiStart),
  multiEnd: (): void => notifyCbs0(touchCbs.multiEnd),
  zoom: (args: Readonly<Zoom>): void => notifyCbs(touchCbs.zoom, args),
}
