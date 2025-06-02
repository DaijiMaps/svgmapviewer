/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { root } from '../Root'
import { styleRoot } from '../Style'
import { type Box } from './box/main'
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { configActorStart, configSend, registerCbs } from './config-xstate'
import { scrollTimeoutActorStart } from './event-xstate'
import { geolocActorStart } from './geo'
import { renderMapActorStart } from './map-xstate'
import { resizeActorStart } from './resize-xstate'
import { scrollActorStart } from './scroll-xstate'
import {
  searchActorStart,
  searchSearchDone,
  searchSearchStart,
} from './search/search-xstate'
import { styleActorStart } from './style-xstate'
import { touchActorStart } from './touch-xstate'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'
import { uiRootActorStart } from './ui-root-xstate'
import { uiActorStart } from './ui-xstate'
import { viewerActorStart } from './viewer-xstate'

// XXX
// XXX
// XXX
// XXX - actual app's entry
// XXX - only imported by src/lib/index.ts
// XXX
// XXX
// XXX

export function svgmapviewer(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
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

  registerCbs({
    searchStartCb: searchSearchStart,
    searchDoneCb: searchSearchDone,
  })

  // eslint-disable-next-line functional/no-conditional-statements
  if (configUser.mapNames) {
    configSend({ type: 'SET.MAPNAMES', mapNames: configUser.mapNames })
  }

  root(config)
  styleRoot()
}

// eslint-disable-next-line functional/functional-parameters
function startAllActors() {
  // reference & ensure all actors are started
  // for module dependency
  // (order doesn't matter)
  configActorStart()
  geolocActorStart()
  renderMapActorStart()
  resizeActorStart()
  scrollActorStart()
  scrollTimeoutActorStart()
  searchActorStart()
  styleActorStart()
  touchActorStart()
  uiActorStart()
  uiRootActorStart()
  viewerActorStart()
}
