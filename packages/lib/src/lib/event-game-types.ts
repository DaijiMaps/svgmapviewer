import type { Cb, Cb1 } from './cb'

export type GameStartCb = Cb
export type GameAnswerCb = Cb1<number>
export type GameReceiveCb = Cb
export type GameResetCb = Cb

export interface GameCbs {
  readonly start: Set<GameStartCb>
  readonly answer: Set<GameAnswerCb>
  readonly receive: Set<GameReceiveCb>
  readonly reset: Set<GameResetCb>
}
