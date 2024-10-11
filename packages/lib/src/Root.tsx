/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { SvgMapViewerConfig } from './lib'
import { svgMapViewerConfig } from './lib/config'

export const SvgMapViewerConfigContext = createContext(svgMapViewerConfig)

export function root(config: Readonly<SvgMapViewerConfig>) {
  createRoot(document.getElementById(config.root)!).render(
    <StrictMode>
      <SvgMapViewerConfigContext.Provider value={config}>
        <App />
      </SvgMapViewerConfigContext.Provider>
      <svg>
        <defs>
          <config.renderMap />
        </defs>
      </svg>
    </StrictMode>
  )
}
