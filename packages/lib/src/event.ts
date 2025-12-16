/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type VecVec } from './lib/vec/prefixed'
import { type Layout } from './lib/viewer/layout'
import type { ViewerMode } from './lib/viewer/viewer-types'
import {
  type AnimationCb,
  type AnimationMatrix,
  type Cb,
  type FloorCb,
  type Info,
  type LayoutCb,
  type ModeCb,
  type ResizeCb,
  type SearchCb,
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

export function notifySearchStart(psvg: VecVec): void {
  searchStartCbs.forEach((cb: SearchStartCb) => cb(psvg))
}
export function notifySearch(psvg: VecVec): void {
  searchCbs.forEach((cb: SearchCb) => cb(psvg))
}
export function notifySearchDone(res: Readonly<null | SearchRes>): void {
  searchDoneCbs.forEach((cb: SearchDoneCb) => cb(res))
}
export function notifySearchEnd(res: Readonly<null | SearchRes>): void {
  searchEndCbs.forEach((cb: SearchEndCb) => cb(res))
}
export function notifySearchEndDone(
  psvg: VecVec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
): void {
  searchEndDoneCbs.forEach((cb: SearchEndDoneCb) => cb(psvg, info, layout))
}
export function notifyUiOpen(
  psvg: VecVec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
): void {
  uiOpenCbs.forEach((cb: UiOpenCb) => cb(psvg, info, layout))
}
export function notifyUiOpenDone(ok: boolean): void {
  uiOpenDoneCbs.forEach((cb: UiOpenDoneCb) => cb(ok))
}
export function notifyUiClose(): void {
  uiCloseCbs.forEach((cb: UiCloseCb) => cb())
}
export function notifyUiCloseDone(): void {
  uiCloseDoneCbs.forEach((cb: UiCloseDoneCb) => cb())
}

export function notifyRendered(): void {
  renderedCbs.forEach((cb) => cb())
}
export function notifyResize(layout: Readonly<Layout>, force: boolean): void {
  resizeCbs.forEach((cb) => cb(layout, force))
}
export function notifyLayout(layout: Readonly<Layout>, force: boolean): void {
  layoutCbs.forEach((cb) => cb(layout, force))
}
export function notifyZoomStart(
  layout: Readonly<Layout>,
  zoom: number,
  z: number
): void {
  zoomStartCbs.forEach((cb: ZoomStartCb) => cb(layout, zoom, z))
}
export function notifyZoomEnd(layout: Readonly<Layout>, zoom: number): void {
  zoomEndCbs.forEach((cb: ZoomEndCb) => cb(layout, zoom))
}
export function notifyAnimation(
  animation: Readonly<null | AnimationMatrix>
): void {
  animationCbs.forEach((cb) => cb(animation))
}
export function notifyMode(mode: ViewerMode): void {
  modeCbs.forEach((cb) => cb(mode))
}

export function notifyFloorLock(fidx: number): void {
  floorLockCbs.forEach((cb) => cb(fidx))
}
export function notifyFloor(fidx: number): void {
  floorCbs.forEach((cb) => cb(fidx))
}
export function notifyFloorDone(fidx: number): void {
  floorDoneCbs.forEach((cb) => cb(fidx))
}
export function notifyFloorUnlock(): void {
  floorUnlockCbs.forEach((cb) => cb())
}
