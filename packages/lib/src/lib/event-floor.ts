import type { FloorCbs } from './event-floor-types'

/* eslint-disable functional/functional-parameters */

/* eslint-disable functional/no-return-void */
import { notifyCbs, notifyCbs0 } from './cb'

export const floorCbs: FloorCbs = {
  lock: new Set(),
  select: new Set(),
  selectDone: new Set(),
  unlock: new Set(),
}

export const notifyFloor = {
  lock: (fidx: number): void => notifyCbs(floorCbs.lock, fidx),
  select: (fidx: number): void => notifyCbs(floorCbs.select, fidx),
  selectDone: (fidx: number): void => notifyCbs(floorCbs.selectDone, fidx),
  unlock: (): void => notifyCbs0(floorCbs.unlock),
}
