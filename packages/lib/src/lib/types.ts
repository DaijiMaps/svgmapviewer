/* eslint-disable functional/no-mixed-types */
/* eslint-disable functional/no-return-void */
import { BoxBox } from './box/prefixed'
import { MapLayer, MapMarkers, MapObjects, MapSymbols } from './carto'
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

export type ZoomStartCb = (layout: Layout, zoom: number, z: number) => void
export type ZoomEndCb = (layout: Layout, zoom: number) => void
export type SearchCb = (psvg: Vec) => void
export type SearchDoneCb = (res: Readonly<null | SearchRes>) => void
export type SearchEndCb = (res: Readonly<SearchRes>) => void
export type SearchEndDoneCb = (
  psvg: Vec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
) => void
export type UiOpenCb = (
  psvg: Vec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
) => void
export type UiOpenDoneCb = (ok: boolean) => void
export type UiCloseCb = () => void
export type LayoutCb = (layout: Layout, first: boolean) => void

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
  layoutCbs: Set<LayoutCb>
}

////

export type RenderAssets = () => JSX.Element

export type RenderMap = () => JSX.Element

export type RenderInfo = (props: Readonly<{ info: Info }>) => JSX.Element

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
