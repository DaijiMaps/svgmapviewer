import {
  animationCbs,
  layoutCbs,
  resizeCbs,
  searchCbs,
  searchDoneCbs,
  searchEndCbs,
  searchEndDoneCbs,
  searchStartCbs,
  uiCloseCbs,
  uiCloseDoneCbs,
  uiOpenCbs,
  uiOpenDoneCbs,
  zoomEndCbs,
  zoomStartCbs,
} from './config'
import {
  type Info,
  type SearchCb,
  type SearchDoneCb,
  type SearchEndCb,
  type SearchEndDoneCb,
  type SearchStartCb,
  type UiCloseCb,
  type UiCloseDoneCb,
  type UiOpenCb,
  type UiOpenDoneCb,
  type ZoomEndCb,
  type ZoomStartCb,
} from './types'
import { type VecVec } from './vec/prefixed'
import type { Animation } from './viewer/animation-types'
import { type Layout } from './viewer/layout'

export function notifySearchStart(psvg: VecVec): void {
  searchStartCbs.forEach((cb: SearchStartCb) => cb(psvg))
}
export function notifySearch(psvg: VecVec): void {
  searchCbs.forEach((cb: SearchCb) => cb(psvg))
}
export function notifySearchDone(psvg: VecVec, info: Readonly<Info>): void {
  searchDoneCbs.forEach((cb: SearchDoneCb) => cb({ psvg, info }))
}
export function notifySearchEnd(psvg: VecVec, info: Readonly<Info>): void {
  searchEndCbs.forEach((cb: SearchEndCb) => cb({ psvg, info }))
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

export function notifyResize(layout: Readonly<Layout>, force: boolean): void {
  resizeCbs.forEach((cb) => cb(layout, force))
}
export function notifyLayout(layout: Readonly<Layout>, force: boolean): void {
  layoutCbs.forEach((cb) => cb(layout, force))
}
export function notifyAnimation(animation: null | Readonly<Animation>): void {
  animationCbs.forEach((cb) => cb(animation))
}
