import type { Cb, Cb1 } from './cb'

export type FloorCb = Cb1<number>

export interface FloorCbs {
  readonly lock: Set<FloorCb>
  readonly select: Set<FloorCb>
  readonly levelUp: Set<Cb>
  readonly levelDown: Set<Cb>
  readonly selectDone: Set<FloorCb>
  readonly unlock: Set<Cb>
}

export type FloorActionType = 'FLOOR.LEVEL.UP' | 'FLOOR.LEVEL.DOWN'

export type FloorAction = { type: FloorActionType }
