/* eslint-disable functional/no-return-void */
import type { Cb, Cb1 } from './cb'
import type { Vec } from './vec'

export type UiOpenCb = Cb1<Vec>
export type UiOpenDoneCb = Cb1<boolean>
export type UiCloseCb = Cb
export type UiCloseDoneCb = () => void

export interface UiCbs {
  open: Set<UiOpenCb>
  openDone: Set<UiOpenDoneCb>
  close: Set<UiCloseCb>
  closeDone: Set<UiCloseDoneCb>
}
