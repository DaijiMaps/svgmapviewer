import type { Cb, Cb1 } from './cb'

export type FloorCb = Cb1<number>

export interface FloorCbs {
  readonly lock: Set<FloorCb>
  readonly select: Set<FloorCb>
  readonly selectDone: Set<FloorCb>
  readonly unlock: Set<Cb>
}
