/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type Cb, type Cb1 } from './lib/cb'
import { type VecVec } from './lib/vec/prefixed'
import { type ViewerMode } from './lib/viewer/viewer-types'
import {
  type ActionCbs,
  type AnimationMatrix,
  type FloorCbs,
  type InitCb,
  type ResizeInfo,
  type ScrollCbs,
  type SearchCbs,
  type SearchData,
  type SearchReq,
  type SearchRes,
  type StyleCbs,
  type SvgMapViewerConfig,
  type TouchCbs,
  type TouchZoomCbArgs,
  type UiCbs,
  type ZoomEndInfo,
  type ZoomInfo,
} from './types'

export const initCbs: Set<InitCb> = new Set()

export const scrollAllCbs: ScrollCbs = {
  eventTick: new Set(),
  eventExpire: new Set(),
}

export const searchCbs: SearchCbs = {
  searchStart: new Set(),
  search: new Set(),
  searchDone: new Set(),
  searchEnd: new Set(),
  searchEndDone: new Set(),
}

export const uiCbs: UiCbs = {
  uiOpen: new Set(),
  uiOpenDone: new Set(),
  uiClose: new Set(),
  uiCloseDone: new Set(),
}

export const floorCbs: FloorCbs = {
  floorLock: new Set(),
  floor: new Set(),
  floorDone: new Set(),
  floorUnlock: new Set(),
}

export const renderedCbs: Set<Cb> = new Set()

export const styleCbs: StyleCbs = {
  resize: new Set(),
  layout: new Set(),
  zoomStart: new Set(),
  zoomEnd: new Set(),
  animation: new Set(),
  mode: new Set(),
}

export const actionCbs: ActionCbs = {
  uiActionZoomIn: new Set(),
  uiActionZoomOut: new Set(),
  uiActionReset: new Set(),
  uiActionRecenter: new Set(),
  uiActionRotate: new Set(),
  uiActionPosition: new Set(),
  uiActionFullscreen: new Set(),
}

export const touchCbs: TouchCbs = {
  multiStart: new Set(),
  multiEnd: new Set(),
  zoom: new Set(),
}

////

export function notifyCbs0(cbs: Readonly<Set<Cb>>): void {
  cbs.forEach((cb: Cb) => cb())
}
export function notifyCbs<T>(cbs: Readonly<Set<Cb1<T>>>, args: T): void {
  cbs.forEach((cb: Cb1<T>) => cb(args))
}

export function notifyInit(cfg: Readonly<SvgMapViewerConfig>): void {
  notifyCbs(initCbs, cfg)
}

export function notifyScrollEventTick(
  ev: Readonly<React.UIEvent<HTMLDivElement, Event>>
): void {
  scrollAllCbs.eventTick.forEach((cb) => cb(ev))
}
export function notifyScrollEventExpire(): void {
  notifyCbs0(scrollAllCbs.eventExpire)
}

export function notifySearchStart(req: Readonly<SearchReq>): void {
  notifyCbs(searchCbs.searchStart, req)
}
export function notifySearch(req: Readonly<SearchReq>): void {
  notifyCbs(searchCbs.search, req)
}
export function notifySearchDone(res: Readonly<null | SearchRes>): void {
  notifyCbs(searchCbs.searchDone, res)
}
export function notifySearchEnd(res: Readonly<null | SearchRes>): void {
  notifyCbs(searchCbs.searchEnd, res)
}
export function notifySearchEndDone(data: Readonly<SearchData>): void {
  notifyCbs(searchCbs.searchEndDone, data)
}
export function notifyUiOpen(psvg: VecVec): void {
  notifyCbs(uiCbs.uiOpen, psvg)
}
export function notifyUiOpenDone(ok: boolean): void {
  notifyCbs(uiCbs.uiOpenDone, ok)
}
export function notifyUiClose(): void {
  notifyCbs0(uiCbs.uiClose)
}
export function notifyUiCloseDone(): void {
  notifyCbs0(uiCbs.uiCloseDone)
}

export function notifyRendered(): void {
  notifyCbs0(renderedCbs)
}
export function notifyResize(resize: Readonly<ResizeInfo>): void {
  notifyCbs(styleCbs.resize, resize)
}
export function notifyLayout(resize: Readonly<ResizeInfo>): void {
  notifyCbs(styleCbs.layout, resize)
}
export function notifyZoomStart(zoom: Readonly<ZoomInfo>): void {
  notifyCbs(styleCbs.zoomStart, zoom)
}
export function notifyZoomEnd(end: Readonly<ZoomEndInfo>): void {
  notifyCbs(styleCbs.zoomEnd, end)
}
export function notifyAnimation(a: Readonly<null | AnimationMatrix>): void {
  notifyCbs(styleCbs.animation, a)
}
export function notifyMode(mode: ViewerMode): void {
  notifyCbs(styleCbs.mode, mode)
}

export function notifyFloorLock(fidx: number): void {
  notifyCbs(floorCbs.floorLock, fidx)
}
export function notifyFloor(fidx: number): void {
  notifyCbs(floorCbs.floor, fidx)
}
export function notifyFloorDone(fidx: number): void {
  notifyCbs(floorCbs.floorDone, fidx)
}
export function notifyFloorUnlock(): void {
  notifyCbs0(floorCbs.floorUnlock)
}

export function notifyTouchMultiStart(): void {
  notifyCbs0(touchCbs.multiStart)
}
export function notifyTouchMultiEnd(): void {
  notifyCbs0(touchCbs.multiEnd)
}
export function notifyTouchZoom(args: Readonly<TouchZoomCbArgs>): void {
  notifyCbs(touchCbs.zoom, args)
}

export function notifyActionFullscreen(): void {
  actionCbs.uiActionFullscreen.forEach((cb) => cb())
}
export function notifyActionPosition(): void {
  actionCbs.uiActionPosition.forEach((cb) => cb())
}
export function notifyActionRecenter(): void {
  actionCbs.uiActionRecenter.forEach((cb) => cb())
}
export function notifyActionRotate(): void {
  actionCbs.uiActionRotate.forEach((cb) => cb())
}
export function notifyActionZoomOut(): void {
  actionCbs.uiActionZoomOut.forEach((cb) => cb())
}
export function notifyActionZoomIn(): void {
  actionCbs.uiActionZoomIn.forEach((cb) => cb())
}
