/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { notifyInit } from './event'
import { type Box } from './lib/box/main'
import { geolocActorStart } from './lib/geo'
import { setNames } from './lib/map/names'
import { searchActorStart } from './lib/search/search-xstate'
import { isUiRendered } from './lib/ui/Ui'
import { uiActorStart } from './lib/ui/ui-xstate'
import { isContainerRendered } from './lib/viewer/Container'
import { floorsActorStart } from './lib/viewer/floors-xstate'
import { resizeActorStart } from './lib/viewer/resize-xstate'
import { scrollActorStart } from './lib/viewer/scroll-xstate'
import { touchActorStart } from './lib/viewer/touch-xstate'
import { viewerActorStart } from './lib/viewer/viewer-xstate'
import { root } from './Root'
import { searchWorkerStart } from './search-main'
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

  if (configUser.getMapNames) {
    setNames(
      configUser.getMapNames({
        data: config,
        render: config,
        carto: config.cartoConfig,
        floors: config.floorsConfig,
      })
    )
  }

  notifyInit(config)

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

  // XXX force reference
  searchWorkerStart()
}
