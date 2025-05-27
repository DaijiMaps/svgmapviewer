/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { root } from '../Root'
import { styleRoot } from '../Style'
import { type Box } from './box/main'
import {
  registerCbs,
  svgMapViewerConfig,
  updateSvgMapViewerConfig,
} from './config'
import { configSend, configStart } from './config-xstate'
import { scrollTimeoutActorStart } from './event-xstate'
import { renderMapActorStart } from './map-xstate'
import { pointerStart } from './pointer-xstate'
import { resizeStart } from './resize-xstate'
import { scrollStart } from './scroll-xstate'
import {
  searchSearchDone,
  searchSearchStart,
  searchStart,
} from './search-xstate'
import { styleStart } from './style-xstate'
import { touchActorStart } from './touch-xstate'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'
import { uiRootActorStart } from './ui-root-xstate'
import { uiActorStart } from './ui-xstate'

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

function startAllActors() {
  // reference & ensure all actors are started
  // for module dependency
  // (order doesn't matter)
  configStart()
  pointerStart()
  renderMapActorStart()
  resizeStart()
  scrollStart()
  scrollTimeoutActorStart()
  searchStart()
  styleStart()
  touchActorStart()
  uiActorStart()
  uiRootActorStart()
}
