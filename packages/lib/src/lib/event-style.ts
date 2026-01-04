/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import type {
  AnimationMatrix,
  ResizeInfo,
  ZoomEndInfo,
  ZoomInfo,
} from '../types'
import { notifyCbs, notifyCbs0 } from './cb'
import type { StyleCbs } from './event-style-types'
import type { ViewerMode } from './viewer/viewer-types'

export const styleCbs: StyleCbs = {
  resize: new Set(),
  layout: new Set(),
  zoomStart: new Set(),
  zoomEnd: new Set(),
  animation: new Set(),
  animationEnd: new Set(),
  mode: new Set(),
}

export function notifyStyleResize(resize: Readonly<ResizeInfo>): void {
  notifyCbs(styleCbs.resize, resize)
}

export function notifyStyleLayout(resize: Readonly<ResizeInfo>): void {
  notifyCbs(styleCbs.layout, resize)
}

export function notifyStyleZoomStart(zoom: Readonly<ZoomInfo>): void {
  notifyCbs(styleCbs.zoomStart, zoom)
}

export function notifyStyleZoomEnd(end: Readonly<ZoomEndInfo>): void {
  notifyCbs(styleCbs.zoomEnd, end)
}

export function notifyStyleAnimation(
  a: Readonly<null | AnimationMatrix>
): void {
  notifyCbs(styleCbs.animation, a)
}

export function notifyStyleAnimationEnd(): void {
  notifyCbs0(styleCbs.animationEnd)
}

export function notifyStyleMode(mode: ViewerMode): void {
  notifyCbs(styleCbs.mode, mode)
}
