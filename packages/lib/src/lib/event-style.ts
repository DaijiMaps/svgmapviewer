/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type {
  AnimationMatrix,
  ResizeInfo,
  ZoomEndInfo,
  ZoomInfo,
} from '../types'
import type { StyleCbs } from './event-style-types'
import type { ViewerMode } from './viewer/viewer-types'

import { notifyCbs, notifyCbs0 } from './cb'

export const styleCbs: StyleCbs = {
  resize: new Set(),
  layout: new Set(),
  zoomStart: new Set(),
  zoomEnd: new Set(),
  animation: new Set(),
  animationEnd: new Set(),
  mode: new Set(),
}

export const notifyStyle = {
  resize: (resize: Readonly<ResizeInfo>): void =>
    notifyCbs(styleCbs.resize, resize),
  layout: (resize: Readonly<ResizeInfo>): void =>
    notifyCbs(styleCbs.layout, resize),
  zoomStart: (zoom: Readonly<ZoomInfo>): void =>
    notifyCbs(styleCbs.zoomStart, zoom),
  zoomEnd: (end: Readonly<ZoomEndInfo>): void =>
    notifyCbs(styleCbs.zoomEnd, end),
  animation: (a: Readonly<null | AnimationMatrix>): void =>
    notifyCbs(styleCbs.animation, a),
  animationEnd: (): void => notifyCbs0(styleCbs.animationEnd),
  mode: (mode: ViewerMode): void => notifyCbs(styleCbs.mode, mode),
}
