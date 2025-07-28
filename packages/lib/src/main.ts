/* eslint-disable functional/immutable-data */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { searchDoneCbs, searchStartCbs } from './event'
import { type Box } from './lib/box/main'
import { geolocActorStart } from './lib/geo'
import { setNames } from './lib/map/names'
import { getAddressEntries, workerSearchInit } from './lib/search'
import {
  searchActorStart,
  searchSearchDone,
  searchSearchStart,
} from './lib/search/search-xstate'
import { isUiRendered } from './lib/ui/Ui'
import { uiActorStart } from './lib/ui/ui-xstate'
import { isContainerRendered } from './lib/viewer/Container'
import { floorsActorStart, selectFloor } from './lib/viewer/floors-xstate'
import { resizeActorStart } from './lib/viewer/resize-xstate'
import { scrollActorStart } from './lib/viewer/scroll-xstate'
import { touchActorStart } from './lib/viewer/touch-xstate'
import { viewerActorStart } from './lib/viewer/viewer-xstate'
import { root } from './Root'
import { styleRoot } from './Style'
import { styleActorStart } from './style-xstate'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'

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

  ////

  startAllActors()

  searchStartCbs.add(searchSearchStart)
  searchDoneCbs.add(searchSearchDone)

  if (configUser.getMapNames) {
    setNames(configUser.getMapNames())
  }

  if (config.searchEntries.length > 0) {
    workerSearchInit(getAddressEntries(config.mapData, config.searchEntries))
  }

  if (config.floorsConfig !== undefined) {
    selectFloor(config.floorsConfig.fidx)
  }

  root(config)
  styleRoot()
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
