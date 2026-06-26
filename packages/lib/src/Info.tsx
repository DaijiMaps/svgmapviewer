import { QRCodeSVG } from 'qrcode.react'
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { getConfig } from './config'
import type { SvgMapViewerConfig } from './types'

export function infoRoot(config: Readonly<SvgMapViewerConfig>): void {
  const cfg = getConfig()
  const e = document.getElementById(cfg.root)

  if (e === null) {
    throw new Error('#root not found!')
  }

  createRoot(e).render(
    <StrictMode>
      <div>
        <h1>svgmapviewer</h1>
        <h2>{config.title}</h2>
        <div className="info">
          <QRCodeSVG
            className="qrcode"
            marginSize={6}
            value={getUrl()}
            width="60vmin"
            height="60vmin"
          />
        </div>
        <div>
          <p>Copyright &copy; Daiji Maps</p>
        </div>
        <style>{style}</style>
      </div>
    </StrictMode>
  )
}

// eslint-disable-next-line functional/functional-parameters
function getUrl(): string {
  // strip ?info=1
  return document.location.origin + document.location.pathname
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
