/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import type { ResizeInfo, ZoomInfo } from '../types'
import { notifyCbs, notifyCbs0 } from './cb'
import type { StyleCbs } from './event-style-types'
import type { ViewerMode } from './viewer/viewer-types'

export const styleCbs: StyleCbs = {
  resize: new Set(),
  layout: new Set(),
  zoomStart: new Set(),
  zoomEnd: new Set(),
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
  zoomEnd: (end: Readonly<ZoomInfo>): void => notifyCbs(styleCbs.zoomEnd, end),
  animationEnd: (): void => notifyCbs0(styleCbs.animationEnd),
  mode: (mode: ViewerMode): void => notifyCbs(styleCbs.mode, mode),
}
