/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

import { notifyGame } from '../event-game'
import { useGame } from './game-xstate'

export function RenderGameReset(): ReactNode {
  const game = useGame()
  return (
    <>
      {game && game.completedAt && <p>完了！</p>}
      <p onClick={() => notifyGame.reset()}>（やりなおす）</p>
    </>
  )
}
