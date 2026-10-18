import { notifyCbs, notifyCbs0 } from './cb'
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { GameCbs } from './event-game-types'
import type { GameContext } from './game'
import type { Force, Question } from './game/types'

export const gameCbs: GameCbs = {
  start: new Set(),
  answer: new Set(),
  receive: new Set(),
  reset: new Set(),
}

export const notifyGame = {
  start: (game?: Readonly<GameContext>): void => notifyCbs(gameCbs.start, game),
  answer: (question: Question & Force): void =>
    notifyCbs(gameCbs.answer, question),
  receive: (): void => notifyCbs0(gameCbs.receive),
  reset: (): void => notifyCbs0(gameCbs.reset),
}
