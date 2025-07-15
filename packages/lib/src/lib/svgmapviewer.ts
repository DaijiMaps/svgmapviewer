/* eslint-disable functional/immutable-data */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { root } from '../Root'
import { styleRoot } from '../Style'
import { type Box } from './box/main'
import {
  searchDoneCbs,
  searchStartCbs,
  svgMapViewerConfig,
  updateSvgMapViewerConfig,
} from './config'
import { configActorStart } from './config-xstate'
import { geolocActorStart } from './geo'
import { renderMapActorStart } from './map/map-xstate'
import { setNames } from './map/names'
import { getAddressEntries } from './search'
import { workerSearchInit } from './search/search-main'
import {
  searchActorStart,
  searchSearchDone,
  searchSearchStart,
} from './search/search-xstate'
import { styleActorStart } from './style-xstate'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'
import { isUiRendered } from './ui/Ui'
import { uiActorStart } from './ui/ui-xstate'
import { isContainerRendered } from './viewer/Container'
import { resizeActorStart } from './viewer/resize-xstate'
import { scrollActorStart } from './viewer/scroll-xstate'
import { touchActorStart } from './viewer/touch-xstate'
import { viewerActorStart } from './viewer/viewer-xstate'

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

  root(config)
  styleRoot()
}

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
