/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

import { notifyGame } from '../event-game'

export function RenderGameReset(): ReactNode {
  return <p onClick={() => notifyGame.reset()}>（やり直す）</p>
}
