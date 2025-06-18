/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { createContext, StrictMode, type Context } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { type SvgMapViewerConfig } from './lib'
import { svgMapViewerConfig } from './lib/config'
import { touching } from './lib/touch-xstate'
import { keyDown, keyUp } from './lib/viewer-react'
import { wheeleventmask } from './lib/viewer-xstate'

export const SvgMapViewerConfigContext: Context<SvgMapViewerConfig> =
  createContext(svgMapViewerConfig)

export function root(config: Readonly<SvgMapViewerConfig>): void {
  const e = document.getElementById(config.root)

  if (e === null) {
    throw new Error('#root not found!')
  }

  // XXX consume all wheel events
  // XXX to prevent Safari's horizontal scroll "history navigation"
  e.onwheel = function (ev) {
    //const c = document.querySelector('.container')
    const c = e.children[0] // XXX must be .container

    if (ev.target instanceof HTMLDivElement && ev.target?.id === 'ui') {
      return
    }
    if ((c !== null && c.clientWidth === c.scrollWidth) || wheeleventmask) {
      ev.preventDefault()
    }
  }
  // XXX consume all contextmenu events
  e.oncontextmenu = function (ev) {
    ev.preventDefault()
  }
  /*
  XXX this masking attempt (don't move during touch) is not working
  e.onpointermove = function (ev) {
    if (touching) {
      ev.preventDefault()
    }
  }
  */
  // XXX prevent touch move during multi-touch
  e.ontouchmove = function (ev) {
    if (wheeleventmask) {
      if (ev.target instanceof HTMLDivElement && ev.target?.id === 'ui') {
        return
      }
      ev.preventDefault()
    } else if (!touching) {
      return
    }
    ev.preventDefault()
  }
  /*
  e.onmousedown = function (ev) {
    console.log('mousedown!', ev)
  }
  e.onmousemove = function (ev) {
    console.log('mousemove!', ev)
  }
  e.onmouseup = function (ev) {
    console.log('mouseup!', ev)
  }
  */

  document.title = config.title
  document.body.onkeydown = keyDown
  document.body.onkeyup = keyUp

  createRoot(e).render(
    <StrictMode>
      <SvgMapViewerConfigContext.Provider value={config}>
        <App />
      </SvgMapViewerConfigContext.Provider>
    </StrictMode>
  )
}
