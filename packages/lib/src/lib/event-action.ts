/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { notifyCbs0 } from './cb'
import type { ActionCbs } from './event-action-types'

export const actionCbs: ActionCbs = {
  zoomIn: new Set(),
  zoomOut: new Set(),
  reset: new Set(),
  recenter: new Set(),
  rotate: new Set(),
  position: new Set(),
  fullscreen: new Set(),
}

export function notifyActionFullscreen(): void {
  notifyCbs0(actionCbs.fullscreen)
}
export function notifyActionPosition(): void {
  notifyCbs0(actionCbs.position)
}
export function notifyActionRecenter(): void {
  notifyCbs0(actionCbs.recenter)
}
export function notifyActionReset(): void {
  notifyCbs0(actionCbs.reset)
}
export function notifyActionRotate(): void {
  notifyCbs0(actionCbs.rotate)
}
export function notifyActionZoomOut(): void {
  notifyCbs0(actionCbs.zoomOut)
}
export function notifyActionZoomIn(): void {
  notifyCbs0(actionCbs.zoomIn)
}
