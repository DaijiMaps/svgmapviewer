/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { notifyCbs, notifyCbs0 } from './cb'
import type { FloorCbs } from './event-floor-types'

export const floorCbs: FloorCbs = {
  lock: new Set(),
  select: new Set(),
  selectDone: new Set(),
  unlock: new Set(),
}

export function notifyFloorLock(fidx: number): void {
  notifyCbs(floorCbs.lock, fidx)
}

export function notifyFloorSelect(fidx: number): void {
  notifyCbs(floorCbs.select, fidx)
}

export function notifyFloorSelectDone(fidx: number): void {
  notifyCbs(floorCbs.selectDone, fidx)
}

export function notifyFloorUnlock(): void {
  notifyCbs0(floorCbs.unlock)
}
