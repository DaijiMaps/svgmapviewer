/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import type { Cb, Cb1 } from './lib/cb'
import { type VecVec } from './lib/vec/prefixed'
import type { ViewerMode } from './lib/viewer/viewer-types'
import {
  type AnimationCb,
  type AnimationMatrix,
  type FloorCb,
  type LayoutCb,
  type ModeCb,
  type ResizeCb,
  type ResizeInfo,
  type SearchCb,
  type SearchData,
  type SearchDoneCb,
  type SearchEndCb,
  type SearchEndDoneCb,
  type SearchRes,
  type SearchStartCb,
  type UiCloseCb,
  type UiCloseDoneCb,
  type UiOpenCb,
  type UiOpenDoneCb,
  type ZoomEndCb,
  type ZoomEndInfo,
  type ZoomInfo,
  type ZoomStartCb,
} from './types'

export const searchStartCbs: Set<SearchStartCb> = new Set()
export const searchCbs: Set<SearchCb> = new Set()
export const searchDoneCbs: Set<SearchDoneCb> = new Set()
export const searchEndCbs: Set<SearchEndCb> = new Set()
export const searchEndDoneCbs: Set<SearchEndDoneCb> = new Set()
export const uiOpenCbs: Set<UiOpenCb> = new Set()
export const uiOpenDoneCbs: Set<UiOpenDoneCb> = new Set()
export const uiCloseCbs: Set<UiCloseCb> = new Set()
export const uiCloseDoneCbs: Set<UiCloseDoneCb> = new Set()

export const floorLockCbs: Set<FloorCb> = new Set()
export const floorCbs: Set<FloorCb> = new Set()
export const floorDoneCbs: Set<FloorCb> = new Set()
export const floorUnlockCbs: Set<Cb> = new Set()

export const renderedCbs: Set<Cb> = new Set()
export const resizeCbs: Set<ResizeCb> = new Set()
export const layoutCbs: Set<LayoutCb> = new Set()
export const zoomStartCbs: Set<ZoomStartCb> = new Set()
export const zoomEndCbs: Set<ZoomEndCb> = new Set()
export const animationCbs: Set<AnimationCb> = new Set()
export const modeCbs: Set<ModeCb> = new Set()

export const uiActionZoomInCbs: Set<Cb> = new Set()
export const uiActionZoomOutCbs: Set<Cb> = new Set()
export const uiActionResetCbs: Set<Cb> = new Set()
export const uiActionRecenterCbs: Set<Cb> = new Set()
export const uiActionRotateCbs: Set<Cb> = new Set()
export const uiActionPositionCbs: Set<Cb> = new Set()
export const uiActionFullscreenCbs: Set<Cb> = new Set()

////

export function notifyCbs0(cbs: Readonly<Set<Cb>>): void {
  cbs.forEach((cb: Cb) => cb())
}
export function notifyCbs<T>(cbs: Readonly<Set<Cb1<T>>>, args: T): void {
  cbs.forEach((cb: Cb1<T>) => cb(args))
}

export function notifySearchStart(psvg: VecVec): void {
  notifyCbs(searchStartCbs, psvg)
}
export function notifySearch(psvg: VecVec): void {
  notifyCbs(searchCbs, psvg)
}
export function notifySearchDone(res: Readonly<null | SearchRes>): void {
  notifyCbs(searchDoneCbs, res)
}
export function notifySearchEnd(res: Readonly<null | SearchRes>): void {
  notifyCbs(searchEndCbs, res)
}
export function notifySearchEndDone(data: Readonly<SearchData>): void {
  notifyCbs(searchEndDoneCbs, data)
}
export function notifyUiOpen(psvg: VecVec): void {
  notifyCbs(uiOpenCbs, psvg)
}
export function notifyUiOpenDone(ok: boolean): void {
  notifyCbs(uiOpenDoneCbs, ok)
}
export function notifyUiClose(): void {
  notifyCbs0(uiCloseCbs)
}
export function notifyUiCloseDone(): void {
  notifyCbs0(uiCloseDoneCbs)
}

export function notifyRendered(): void {
  notifyCbs0(renderedCbs)
}
export function notifyResize(resize: Readonly<ResizeInfo>): void {
  notifyCbs(resizeCbs, resize)
}
export function notifyLayout(resize: Readonly<ResizeInfo>): void {
  notifyCbs(layoutCbs, resize)
}
export function notifyZoomStart(zoom: Readonly<ZoomInfo>): void {
  notifyCbs(zoomStartCbs, zoom)
}
export function notifyZoomEnd(end: Readonly<ZoomEndInfo>): void {
  notifyCbs(zoomEndCbs, end)
}
export function notifyAnimation(a: Readonly<null | AnimationMatrix>): void {
  notifyCbs(animationCbs, a)
}
export function notifyMode(mode: ViewerMode): void {
  notifyCbs(modeCbs, mode)
}

export function notifyFloorLock(fidx: number): void {
  notifyCbs(floorLockCbs, fidx)
}
export function notifyFloor(fidx: number): void {
  notifyCbs(floorCbs, fidx)
}
export function notifyFloorDone(fidx: number): void {
  notifyCbs(floorDoneCbs, fidx)
}
export function notifyFloorUnlock(): void {
  notifyCbs0(floorUnlockCbs)
}
