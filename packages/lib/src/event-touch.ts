/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import type { TouchCbs } from './event-touch-types'
import { notifyCbs, notifyCbs0 } from './lib/cb'
import type { Zoom } from './types'

export const touchCbs: TouchCbs = {
  multiStart: new Set(),
  multiEnd: new Set(),
  zoom: new Set(),
}

export function notifyTouchMultiStart(): void {
  notifyCbs0(touchCbs.multiStart)
}
export function notifyTouchMultiEnd(): void {
  notifyCbs0(touchCbs.multiEnd)
}
export function notifyTouchZoom(args: Readonly<Zoom>): void {
  notifyCbs(touchCbs.zoom, args)
}
