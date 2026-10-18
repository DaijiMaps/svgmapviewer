/* eslint-disable functional/functional-parameters */

/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

import { getConfig } from './config'
import { useModeGame } from './mode-game-xstate'
import type { SvgMapViewerConfig } from './types'

export function gameRoot(config: Readonly<SvgMapViewerConfig>): void {
  const cfg = getConfig()
  const e = document.getElementById(cfg.root)

  // eslint-disable-next-line functional/immutable-data
  document.title = `svgmapviewer - ${config.title}`

  if (e === null) {
    throw new Error('#root not found!')
  }

  createRoot(e).render(
    <StrictMode>
      <ModeGame />
    </StrictMode>
  )
}

function ModeGame(): ReactNode {
  const game = useModeGame()
  return !game.game ? (
    <></>
  ) : (
    <div>
      <h1>Game</h1>
      <p>{JSON.stringify(game.game?.questions)}</p>
      <div>
        <p>Copyright &copy; Daiji Maps</p>
      </div>
      <style>{style}</style>
    </div>
  )
}

const style = `
:root {
  font-family: sans-serif;
  text-align: center;
}
h1 {
  font-size: 1.25em;
}
h2 {
  font-size: 2em;
}
a, a:link, a:visited, a:hover, a:active {
  color: black;
}
`
