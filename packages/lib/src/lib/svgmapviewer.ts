/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { rootActor } from '../MapHtml'
import { root } from '../Root'
import { styleActor, styleRoot } from '../Style'
import { Box } from './box/main'
import {
  configActor,
  svgMapViewerConfig,
  updateSvgMapViewerConfig,
} from './config'
import { renderMapActor } from './map-xstate'
import { pointerActor, scrollTimeoutActor } from './pointer-react'
import { resizeActor } from './resize-react'
import { searchSearchDone, searchSearchStart } from './search'
import { SvgMapViewerConfig, SvgMapViewerConfigUser } from './types'
import { uiActor } from './ui-xstate'

// XXX
// XXX
// XXX
// XXX - actual app's entry
// XXX - only imported by src/lib/index.ts
// XXX
// XXX
// XXX

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

  updateSvgMapViewerConfig({
    ...svgMapViewerConfig,
  })

  const config: SvgMapViewerConfig = {
    ...svgMapViewerConfig,
    origViewBox,
    ...configUser,
  }

  ////

  startAllActors()

  configActor.send({
    type: 'ADD.CB',
    searchStartCb: searchSearchStart,
    searchDoneCb: searchSearchDone,
  })

  // eslint-disable-next-line functional/no-conditional-statements
  if (configUser.mapNames) {
    configActor.start()
    configActor.send({ type: 'SET.MAPNAMES', mapNames: configUser.mapNames })
  }

  root(config)
  styleRoot()
}

function startAllActors() {
  // reference & ensure all actors are started
  // for module dependency
  // (order doesn't matter)
  configActor.start()
  pointerActor.start()
  renderMapActor.start()
  resizeActor.start()
  rootActor.start()
  scrollTimeoutActor.start()
  styleActor.start()
  uiActor.start()
}
