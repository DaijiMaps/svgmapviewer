/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { root } from '../Root'
import { styleRoot } from '../Style'
import { type Box } from './box/main'
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { configActorStart, configSend, registerCbs } from './config-xstate'
import { geolocActorStart } from './geo'
import { renderMapActorStart } from './map-xstate'
import { resizeActorStart } from './resize-xstate'
import { scrollActorStart } from './scroll-xstate'
import { getAddressEntries } from './search'
import { workerSearchInit } from './search/search-main'
import {
  searchActorStart,
  searchSearchDone,
  searchSearchStart,
} from './search/search-xstate'
import { styleActorStart } from './style-xstate'
import { touchActorStart } from './touch-xstate'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'
import { uiActorStart } from './ui-xstate'
import { viewerActorStart } from './viewer-xstate'

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

  if (configUser.getMapNames) {
    configSend({ type: 'SET.MAPNAMES', mapNames: configUser.getMapNames() })
  }

  if (config.searchEntries.length > 0) {
    workerSearchInit(getAddressEntries(config.mapData, config.searchEntries))
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
  searchActorStart()
  styleActorStart()
  touchActorStart()
  uiActorStart()
  viewerActorStart()
}
