import type {
  AnimationMatrix,
  ResizeInfo,
  ZoomEndInfo,
  ZoomInfo,
} from '../types'
import type { Cb, Cb1 } from './cb'
import type { ViewerMode } from './viewer/viewer-types'

export type ZoomStartCb = Cb1<Readonly<Omit<ZoomInfo, 'z'>>>
export type ZoomEndCb = Cb1<Readonly<ZoomEndInfo>>
export type ResizeCb = Cb1<Readonly<ResizeInfo>>
export type LayoutCb = Cb1<Readonly<ResizeInfo>>
export type AnimationCb = Cb1<Readonly<null | AnimationMatrix>>
export type ModeCb = Cb1<ViewerMode>

export interface StyleCbs {
  resize: Set<ResizeCb>
  layout: Set<LayoutCb>
  zoomStart: Set<ZoomStartCb>
  zoomEnd: Set<ZoomEndCb>
  animation: Set<AnimationCb>
  animationEnd: Set<Cb>
  mode: Set<ModeCb>
}
