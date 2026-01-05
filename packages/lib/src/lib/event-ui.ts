/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { UiCbs } from './event-ui-types'
import type { VecVec } from './vec/prefixed'

import { notifyCbs, notifyCbs0 } from './cb'

export const uiCbs: UiCbs = {
  open: new Set(),
  openDone: new Set(),
  close: new Set(),
  closeDone: new Set(),
}

export const notifyUi = {
  open: (psvg: VecVec): void => notifyCbs(uiCbs.open, psvg),
  openDone: (ok: boolean): void => notifyCbs(uiCbs.openDone, ok),
  close: (): void => notifyCbs0(uiCbs.close),
  closeDone: (): void => notifyCbs0(uiCbs.closeDone),
}
