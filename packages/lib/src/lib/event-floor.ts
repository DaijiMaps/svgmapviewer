/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { FloorCbs } from './event-floor-types'

import { notifyCbs, notifyCbs0 } from './cb'

export const floorCbs: FloorCbs = {
  lock: new Set(),
  select: new Set(),
  levelUp: new Set(),
  levelDown: new Set(),
  selectDone: new Set(),
  unlock: new Set(),
}

export const notifyFloor = {
  lock: (fidx: number): void => notifyCbs(floorCbs.lock, fidx),
  select: (fidx: number): void => notifyCbs(floorCbs.select, fidx),
  levelUp: (): void => notifyCbs0(floorCbs.levelUp),
  levelDown: (): void => notifyCbs0(floorCbs.levelDown),
  selectDone: (fidx: number): void => notifyCbs(floorCbs.selectDone, fidx),
  unlock: (): void => notifyCbs0(floorCbs.unlock),
}
