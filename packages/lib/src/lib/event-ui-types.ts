import type { Cb, Cb1 } from './cb'
import type { Vec } from './vec'

export type UiOpenCb = Cb1<Vec>
export type UiOpenDoneCb = Cb1<boolean>
export type UiCloseCb = Cb
export type UiCloseDoneCb = Cb

export interface UiCbs {
  readonly open: Set<UiOpenCb>
  readonly openDone: Set<UiOpenDoneCb>
  readonly close: Set<UiCloseCb>
  readonly closeDone: Set<UiCloseDoneCb>
}
