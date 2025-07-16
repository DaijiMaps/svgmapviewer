/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createElement } from 'react'
import { RenderMapDefault } from './Map'
import { emptyMapData } from './lib/geo/data-types'
import { type VecVec } from './lib/vec/prefixed'
import type { Animation } from './lib/viewer/animation-types'
import { type Layout } from './lib/viewer/layout'
import {
  type AnimationCb,
  type Cb,
  type Info,
  type LayoutCb,
  type RenderInfo,
  type ResizeCb,
  type SearchCb,
  type SearchDoneCb,
  type SearchEndCb,
  type SearchEndDoneCb,
  type SearchStartCb,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
  type UiCloseCb,
  type UiCloseDoneCb,
  type UiOpenCb,
  type UiOpenDoneCb,
  type ZoomEndCb,
  type ZoomStartCb,
} from './types'

const renderInfoDefault: RenderInfo = (
  props: Readonly<{ info: Readonly<Info> }>
) => createElement('p', {}, props.info.title)

// XXX
// XXX migrate to configActor
// XXX
export let svgMapViewerConfig: SvgMapViewerConfig = {
  root: 'root',
  map: 'map',
  href: 'map.svg',
  width: 0,
  height: 0,
  fontSize: 16,
  origViewBox: { x: 0, y: 0, width: 0, height: 0 },
  title: 'svgmapviewer',
  subtitle:
    'svgmapviewer - An (opinionated) interactive offline SVG map viewer',
  copyright: '@ Daiji Maps',
  zoomFactor: 3,
  animationDuration: 625,
  scrollIdleTimeout: 1000,
  isContainerRendered: () => true,
  isUiRendered: () => true,

  // RenderConfig
  getMapLayers: () => [],
  getMapObjects: () => [],
  getMapSymbols: () => [],
  getMapMarkers: () => [],
  getMapNames: () => [],
  searchEntries: [],
  renderInfo: renderInfoDefault,
  mapSvgStyle: '',
  renderMap: RenderMapDefault,
  isMapRendered: () => true,

  // DataConfig
  mapData: emptyMapData,
  mapMap: {
    pointMap: new Map(),
    lineMap: new Map(),
    multilinestringMap: new Map(),
    multipolygonMap: new Map(),
  },
  mapCoord: {
    matrix: new DOMMatrixReadOnly(),
  },
}

export function updateSvgMapViewerConfig(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  svgMapViewerConfig = {
    ...svgMapViewerConfig,
    ...(configUser as SvgMapViewerConfig),
  }
}

////

export const searchStartCbs: Set<SearchStartCb> = new Set()
export const searchCbs: Set<SearchCb> = new Set()
export const searchDoneCbs: Set<SearchDoneCb> = new Set()
export const searchEndCbs: Set<SearchEndCb> = new Set()
export const searchEndDoneCbs: Set<SearchEndDoneCb> = new Set()
export const uiOpenCbs: Set<UiOpenCb> = new Set()
export const uiOpenDoneCbs: Set<UiOpenDoneCb> = new Set()
export const uiCloseCbs: Set<UiCloseCb> = new Set()
export const uiCloseDoneCbs: Set<UiCloseDoneCb> = new Set()
export const zoomStartCbs: Set<ZoomStartCb> = new Set()
export const zoomEndCbs: Set<ZoomEndCb> = new Set()
export const resizeCbs: Set<ResizeCb> = new Set()
export const layoutCbs: Set<LayoutCb> = new Set()
export const animationCbs: Set<AnimationCb> = new Set()
export const uiActionZoomInCbs: Set<Cb> = new Set()
export const uiActionZoomOutCbs: Set<Cb> = new Set()
export const uiActionResetCbs: Set<Cb> = new Set()
export const uiActionRecenterCbs: Set<Cb> = new Set()
export const uiActionPositionCbs: Set<Cb> = new Set()
export const uiActionFullscreenCbs: Set<Cb> = new Set()

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
