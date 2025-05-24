/* eslint-disable functional/no-mixed-types */
/* eslint-disable functional/no-return-void */
import { ReactNode } from 'react'
import { BoxBox } from './box/prefixed'
import { MapLayer, MapMarkers, MapObjects, MapSymbols } from './carto'
import { LayoutCoord } from './coord'
import { MapData, POI } from './geo'
import { Layout } from './layout'
import { Vec } from './vec'

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

export interface ConfigZoomStart {
  type: 'CONFIG.ZOOM.START'
  layout: Readonly<Layout>
  zoom: number
  z: number
}
export interface ConfigResize {
  type: 'CONFIG.RESIZE'
  layout: Readonly<Layout>
  force: boolean
}
export interface ConfigLayout {
  type: 'CONFIG.LAYOUT'
  layout: Readonly<Layout>
  force: boolean
}

export type ZoomStartCb = (
  layout: Readonly<Layout>,
  zoom: number,
  z: number
) => void
export type ZoomEndCb = (layout: Readonly<Layout>, zoom: number) => void
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
export type ResizeCb = (layout: Layout, force: boolean) => void
export type LayoutCb = (layout: Layout, force: boolean) => void

export interface ConfigCb {
  zoomStartCb: ZoomStartCb
  zoomEndCb: ZoomEndCb
  searchStartCb: SearchCb
  searchCb: SearchCb
  searchDoneCb: SearchDoneCb
  searchEndCb: SearchEndCb
  searchEndDoneCb: SearchEndDoneCb
  uiOpenCb: UiOpenCb
  uiOpenDoneCb: UiOpenDoneCb
  uiCloseCb: UiCloseCb
  uiCloseDoneCb: UiCloseCb
  resizeCb: ResizeCb
  layoutCb: LayoutCb
}

export interface ConfigCbs {
  zoomStartCbs: Set<ZoomStartCb>
  zoomEndCbs: Set<ZoomEndCb>
  searchStartCbs: Set<SearchCb>
  searchCbs: Set<SearchCb>
  searchDoneCbs: Set<SearchDoneCb>
  searchEndCbs: Set<SearchEndCb>
  searchEndDoneCbs: Set<SearchEndDoneCb>
  uiOpenCbs: Set<UiOpenCb>
  uiOpenDoneCbs: Set<UiOpenDoneCb>
  uiCloseCbs: Set<UiCloseCb>
  uiCloseDoneCbs: Set<UiCloseCb>
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
  //renderMap: RenderMap
  renderInfo: RenderInfo
  mapData: MapData
  mapCoord: {
    toGeo: (p: Vec) => Vec
    fromGeo: (p: Vec) => Vec
  }
  mapHtmlStyle: string
  mapSymbols: POI[]
  mapNames: POI[]
}

export type SvgMapViewerConfigUser = Partial<SvgMapViewerConfig>
