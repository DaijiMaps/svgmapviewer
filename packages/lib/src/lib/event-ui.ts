import type { UiCbs } from './event-ui-types'
import type { VecVec } from './vec/prefixed'

/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { notifyCbs, notifyCbs0 } from './cb'

export const uiCbs: UiCbs = {
  open: new Set(),
  openDone: new Set(),
  close: new Set(),
  closeDone: new Set(),
}

export function notifyUiOpen(psvg: VecVec): void {
  notifyCbs(uiCbs.open, psvg)
}

export function notifyUiOpenDone(ok: boolean): void {
  notifyCbs(uiCbs.openDone, ok)
}

export function notifyUiClose(): void {
  notifyCbs0(uiCbs.close)
}

export function notifyUiCloseDone(): void {
  notifyCbs0(uiCbs.closeDone)
}
