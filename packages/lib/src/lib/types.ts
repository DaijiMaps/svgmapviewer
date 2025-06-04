/* eslint-disable functional/no-mixed-types */
/* eslint-disable functional/no-return-void */
import { type ReactNode } from 'react'
import { type BoxBox } from './box/prefixed'
import {
  type MapLayer,
  type MapMarkers,
  type MapObjects,
  type MapSymbols,
} from './carto/types'
import type { SearchEntry } from './geo'
import { type MapCoord, type MapData, type MapMap } from './geo/data-types'
import { type POI } from './geo/poi-types'
import { type Layout, type LayoutCoord } from './layout-types'
import { type Vec } from './vec'

//// layout

// top, right, bottom, left
export type Dir = 0 | 1 | 2 | 3

export interface Size {
  width: number
  height: number
}

export interface Info {
  title: string
}

export interface SearchReq {
  psvg: Vec
}

export interface SearchRes {
  psvg: Vec
  info: Readonly<Info>
}

export interface SearchResP {
  psvg: Vec
  info: Readonly<Info>
  p: Vec // cclient
}

////

export type ZoomStartCb = (
  layout: Readonly<Layout>,
  zoom: number,
  z: number
) => void
export type ZoomEndCb = (layout: Readonly<Layout>, zoom: number) => void
export type SearchStartCb = (psvg: Vec) => void
export type SearchCb = (psvg: Vec) => void
export type SearchDoneCb = (res: Readonly<null | SearchRes>) => void
export type SearchEndCb = (res: Readonly<SearchRes>) => void
export type SearchEndDoneCb = (
  psvg: Vec,
  info: Readonly<Info>,
  layout: Readonly<LayoutCoord>
) => void
export type UiOpenCb = (
  psvg: Vec,
  info: Readonly<Info>,
  layout: Readonly<LayoutCoord>
) => void
export type UiOpenDoneCb = (ok: boolean) => void
export type UiCloseCb = () => void
export type UiCloseDoneCb = () => void
export type ResizeCb = (layout: Layout, force: boolean) => void
export type LayoutCb = (layout: Layout, force: boolean) => void

export type GeoLocCb = () => void
export type GeoLocDoneCb = (position: GeolocationPosition) => void

export interface ConfigCb {
  zoomStartCb: ZoomStartCb
  zoomEndCb: ZoomEndCb
  searchStartCb: SearchStartCb
  searchCb: SearchCb
  searchDoneCb: SearchDoneCb
  searchEndCb: SearchEndCb
  searchEndDoneCb: SearchEndDoneCb
  uiOpenCb: UiOpenCb
  uiOpenDoneCb: UiOpenDoneCb
  uiCloseCb: UiCloseCb
  uiCloseDoneCb: UiCloseDoneCb
  resizeCb: ResizeCb
  layoutCb: LayoutCb
}

export interface ConfigCbs {
  zoomStartCbs: Set<ZoomStartCb>
  zoomEndCbs: Set<ZoomEndCb>
  searchStartCbs: Set<SearchStartCb>
  searchCbs: Set<SearchCb>
  searchDoneCbs: Set<SearchDoneCb>
  searchEndCbs: Set<SearchEndCb>
  searchEndDoneCbs: Set<SearchEndDoneCb>
  uiOpenCbs: Set<UiOpenCb>
  uiOpenDoneCbs: Set<UiOpenDoneCb>
  uiCloseCbs: Set<UiCloseCb>
  uiCloseDoneCbs: Set<UiCloseDoneCb>
  resizeCbs: Set<ResizeCb>
  layoutCbs: Set<LayoutCb>
}

////

export type RenderAssets = () => ReactNode

export type RenderMap = () => ReactNode

export type RenderInfo = (props: Readonly<{ info: Info }>) => ReactNode

////

export interface SvgMapViewerConfig {
  root: string
  map: string
  href: string
  width: number
  height: number
  fontSize: number
  origViewBox: BoxBox
  title: string
  subtitle: string
  copyright: string
  zoomFactor: number
  animationDuration: number
  dragStepAlpha: number
  dragStepStepLimit: number
  dragStepMaxCount: number
  scrollIdleTimeout: number
  //renderAssets: RenderAssets
  getMapLayers: () => MapLayer[]
  getMapObjects: () => MapObjects[]
  getMapSymbols: () => MapSymbols[]
  getMapMarkers: () => MapMarkers[]
  getMapNames: () => POI[]
  searchEntries: SearchEntry[]
  //renderMap: RenderMap
  renderInfo: RenderInfo
  mapData: MapData
  mapMap: MapMap
  mapCoord: MapCoord
}

export type SvgMapViewerConfigUser = Partial<SvgMapViewerConfig>
