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

export function notifyInit(cfg: Readonly<SvgMapViewerConfig>): void {
  notifyCbs(globalCbs.init, cfg)
}

export function notifyRendered(): void {
  notifyCbs0(globalCbs.rendered)
}
