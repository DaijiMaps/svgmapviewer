import type { AnimationMatrix, ResizeInfo, ZoomInfo, ZoomSync } from '../types'
import type { Cb, Cb1 } from './cb'
import type { ViewerMode } from './viewer/viewer-types'

export type ZoomCb = Cb1<Readonly<ZoomInfo>>
export type ZoomSyncCb = Cb1<Readonly<null | ZoomSync>>
export type ResizeCb = Cb1<Readonly<ResizeInfo>>
export type LayoutCb = Cb1<Readonly<ResizeInfo>>
export type AnimationCb = Cb1<Readonly<null | AnimationMatrix>>
export type ModeCb = Cb1<ViewerMode>

export interface StyleCbs {
  readonly resize: Set<ResizeCb>
  readonly layout: Set<LayoutCb>
  readonly zoom: Set<ZoomCb>
  readonly zoomSync: Set<ZoomSyncCb>
  readonly animationEnd: Set<Cb>
  readonly mode: Set<ModeCb>
}
