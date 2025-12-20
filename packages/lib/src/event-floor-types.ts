import type { Cb, Cb1 } from './lib/cb'

export type FloorCb = Cb1<number>

export interface FloorCbs {
  lock: Set<FloorCb>
  select: Set<FloorCb>
  selectDone: Set<FloorCb>
  unlock: Set<Cb>
}
