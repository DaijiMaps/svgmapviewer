/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { positionCbsStart } from './lib/geo/position-xstate'
import { namesCbsStart } from './lib/map/names'
import { searchCbsStart } from './lib/search/search-xstate'
import { styleCbsStart } from './lib/style/style-xstate'
import { fullscreenCbsStart } from './lib/ui/fullscreen'
import { uiCbsStart } from './lib/ui/ui-xstate'
import { floorsCbsStart } from './lib/viewer/floors-xstate'
import { scrollCbsStart } from './lib/viewer/scroll-xstate'
import { touchCbsStart } from './lib/viewer/touch-xstate'
import { viewerCbsStart } from './lib/viewer/viewer-xstate'
import { searchWorkerCbsStart } from './lib/search/search-main'

export function startAllCbs(): void {
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
