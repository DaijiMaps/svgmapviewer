/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { Box } from './lib/box/main'
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './lib/config'
import { searchSearchDone, searchSearchStart } from './lib/search'
import { SvgMapViewerConfig, SvgMapViewerConfigUser } from './lib/types'

export type { SvgMapViewerConfig, SvgMapViewerConfigUser }

export const SvgMapViewerConfigContext = createContext(svgMapViewerConfig)

export function svgmapviewer(configUser: Readonly<SvgMapViewerConfigUser>) {
  const origViewBox: Box = {
    x: 0,
    y: 0,
    width: typeof configUser.width === 'number' ? configUser.width : 0,
    height: typeof configUser.height === 'number' ? configUser.height : 0,
  }
  updateSvgMapViewerConfig({
    origViewBox,
    ...configUser,
  })
  const config: SvgMapViewerConfig = {
    ...svgMapViewerConfig,
    origViewBox,
    ...configUser,
  }

  svgMapViewerConfig.searchStartCbs.add(searchSearchStart)
  svgMapViewerConfig.searchDoneCbs.add(searchSearchDone)

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
