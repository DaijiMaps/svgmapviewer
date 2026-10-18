/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { getConfig } from './config'
import type { SvgMapViewerConfig } from './types'

export function settingsRoot(config: Readonly<SvgMapViewerConfig>): void {
  const cfg = getConfig()
  const e = document.getElementById(cfg.root)

  if (e === null) {
    throw new Error('#root not found!')
  }

  createRoot(e).render(
    <StrictMode>
      <div>
        <h1>svgmapviewer - {config.title}</h1>
        <div>
          <p>Copyright &copy; Daiji Maps</p>
        </div>
        <style>{style}</style>
      </div>
    </StrictMode>
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
