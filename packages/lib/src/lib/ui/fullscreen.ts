/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */

import { actionCbs } from '../event-action'

async function toggleFullscreen(): Promise<void> {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen().catch()
  } else {
    await document.exitFullscreen().catch()
  }
}

export function fullscreenCbsStart(): void {
  actionCbs.fullscreen.add(toggleFullscreen)
}
