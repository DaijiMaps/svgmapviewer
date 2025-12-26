/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { positionActorStart } from './lib/position/position-xstate'
import { searchActorStart } from './lib/search/search-xstate'
import { styleActorStart } from './lib/style/style-xstate'
import { uiActorStart } from './lib/ui/ui-xstate'
import { floorsActorStart } from './lib/viewer/floors/floors-xstate'
import { resizeActorStart } from './lib/viewer/resize-xstate'
import { scrollActorStart } from './lib/viewer/scroll/scroll-xstate'
import { touchActorStart } from './lib/viewer/touch-xstate'
import { viewerActorStart } from './lib/viewer/viewer-xstate'

export function startAllActors(): void {
  // reference & ensure all actors are started
  // for module dependency
  // (order doesn't matter)
  floorsActorStart()
  positionActorStart()
  resizeActorStart()
  scrollActorStart()
  searchActorStart()
  styleActorStart()
  touchActorStart()
  uiActorStart()
  viewerActorStart()
}
