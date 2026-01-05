import type { ActionCbs } from './event-action-types'

/* eslint-disable functional/functional-parameters */

/* eslint-disable functional/no-return-void */
import { notifyCbs0 } from './cb'

export const actionCbs: ActionCbs = {
  zoomIn: new Set(),
  zoomOut: new Set(),
  rotate: new Set(),
  reset: new Set(),
  recenter: new Set(),
  fullscreen: new Set(),
  position: new Set(),
}

export const notifyAction = {
  zoomIn: (): void => notifyCbs0(actionCbs.zoomIn),
  zoomOut: (): void => notifyCbs0(actionCbs.zoomOut),
  rotate: (): void => notifyCbs0(actionCbs.rotate),
  reset: (): void => notifyCbs0(actionCbs.reset),
  recenter: (): void => notifyCbs0(actionCbs.recenter),
  fullscreen: (): void => notifyCbs0(actionCbs.fullscreen),
  position: (): void => notifyCbs0(actionCbs.position),
}
