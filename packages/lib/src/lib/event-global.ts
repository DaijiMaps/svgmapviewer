/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import type { SvgMapViewerConfig } from '../types'
import type { GlobalCbs } from './event-global-types'

import { notifyCbs, notifyCbs0 } from './cb'

export const globalCbs: GlobalCbs = {
  init: new Set(),
  rendered: new Set(),
}

export const notifyGlobal = {
  init: function (cfg: Readonly<SvgMapViewerConfig>): void {
    notifyCbs(globalCbs.init, cfg)
  },
  rendered: function (): void {
    notifyCbs0(globalCbs.rendered)
  },
}
