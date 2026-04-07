import type { AnimationMatrix, ResizeInfo, ZoomInfo } from '../types'
import type { Cb, Cb1 } from './cb'
import type { ViewerMode } from './viewer/viewer-types'

export type ZoomStartCb = Cb1<Readonly<ZoomInfo>>
export type ZoomEndCb = Cb1<Readonly<ZoomInfo>>
export type ResizeCb = Cb1<Readonly<ResizeInfo>>
export type LayoutCb = Cb1<Readonly<ResizeInfo>>
export type AnimationCb = Cb1<Readonly<null | AnimationMatrix>>
export type ModeCb = Cb1<ViewerMode>

export interface StyleCbs {
  readonly resize: Set<ResizeCb>
  readonly layout: Set<LayoutCb>
  readonly zoomStart: Set<ZoomStartCb>
  readonly zoomEnd: Set<ZoomEndCb>
  readonly animationEnd: Set<Cb>
  readonly mode: Set<ModeCb>
}
