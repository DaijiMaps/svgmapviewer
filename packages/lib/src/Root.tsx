/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { SvgMapViewerConfig } from './lib'
import { svgMapViewerConfig } from './lib/config'
import { keyDown, keyUp } from './lib/pointer-react'
import { RenderMap } from './Map'

export const SvgMapViewerConfigContext = createContext(svgMapViewerConfig)

export function root(config: Readonly<SvgMapViewerConfig>) {
  const e = document.getElementById(config.root)

  if (e === null) {
    throw new Error('#root not found!')
  }

  // XXX consume all wheel events
  // XXX to prevent Safari's horizontal scroll "history navigation"
  e.onwheel = (ev) => {
    //const c = document.querySelector('.container')
    const c = e.children[0] // XXX must be .container

    if (c !== null && c.clientWidth === c.scrollWidth) {
      ev.preventDefault()
    }
  }

  document.body.onkeydown = keyDown
  document.body.onkeyup = keyUp

  createRoot(e).render(
    <StrictMode>
      <SvgMapViewerConfigContext.Provider value={config}>
        <App />
      </SvgMapViewerConfigContext.Provider>
      <svg>
        <defs>
          <RenderMap />
        </defs>
      </svg>
    </StrictMode>
  )
}
