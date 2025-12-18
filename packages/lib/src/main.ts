/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { notifyInit } from './event'
import { type Box } from './lib/box/main'
import { geolocActorStart } from './lib/geo'
import { positionCbsStart } from './lib/geo/position-xstate'
import { namesCbsStart } from './lib/map/names'
import { searchActorStart, searchCbsStart } from './lib/search/search-xstate'
import { fullscreenCbsStart } from './lib/ui/fullscreen'
import { isUiRendered } from './lib/ui/Ui'
import { uiActorStart, uiCbsStart } from './lib/ui/ui-xstate'
import { isContainerRendered } from './lib/viewer/Container'
import { floorsActorStart, floorsCbsStart } from './lib/viewer/floors-xstate'
import { resizeActorStart } from './lib/viewer/resize-xstate'
import { scrollCbsStart } from './lib/viewer/scroll'
import { scrollActorStart } from './lib/viewer/scroll-xstate'
import { touchActorStart, touchCbsStart } from './lib/viewer/touch-xstate'
import { viewerActorStart, viewerCbsStart } from './lib/viewer/viewer-xstate'
import { root } from './Root'
import { searchWorkerCbsStart } from './search-main'
import { styleRoot } from './Style'
import { styleActorStart, styleCbsStart } from './style-xstate'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'

function updateConfig(
  configUser: Readonly<SvgMapViewerConfigUser>
): SvgMapViewerConfig {
  const origViewBox: Box = {
    x: 0,
    y: 0,
    width: typeof configUser.width === 'number' ? configUser.width : 0,
    height: typeof configUser.height === 'number' ? configUser.height : 0,
  }

  updateSvgMapViewerConfig({
    origViewBox,
    isContainerRendered,
    isUiRendered,
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

  return config
}

function startAllCbs() {
  floorsCbsStart()
  fullscreenCbsStart()
  namesCbsStart()
  positionCbsStart()
  scrollCbsStart()
  searchCbsStart()
  searchWorkerCbsStart()
  styleCbsStart()
  touchCbsStart()
  uiCbsStart()
  viewerCbsStart()
}

function startAllActors() {
  // reference & ensure all actors are started
  // for module dependency
  // (order doesn't matter)
  floorsActorStart()
  geolocActorStart()
  resizeActorStart()
  scrollActorStart()
  searchActorStart()
  styleActorStart()
  touchActorStart()
  uiActorStart()
  viewerActorStart()
}

export function svgmapviewer(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  startAllCbs()
  startAllActors()

  const config = updateConfig(configUser)

  notifyInit(config)

  root(config)
  styleRoot()
}
