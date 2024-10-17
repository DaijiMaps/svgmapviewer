/* eslint-disable functional/no-mixed-types */
/* eslint-disable functional/no-return-void */
import { BoxBox } from './box/prefixed'
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
  p: Vec
  psvg: Vec
}

export interface SearchRes {
  p: Vec
  psvg: Vec
  info: Readonly<Info>
}

export type ZoomStartCb = (layout: Layout, zoom: number, z: number) => void
export type ZoomEndCb = (layout: Layout, zoom: number) => void

export type SearchCb = (p: Vec, psvg: Vec) => void

export type SearchDoneCb = (res: Readonly<null | SearchRes>) => void

export type UiOpenCb = (p: Vec, psvg: Vec, info: Readonly<Info>) => void

export type UiOpenDoneCb = (ok: boolean) => void

export type UiCloseCb = () => void

export type Conv = (p: Vec) => Vec

export type RenderMap = (
  props: Readonly<{ zoom: number; z: null | number }>
) => JSX.Element

export type RenderInfo = (props: Readonly<{ info: Info }>) => JSX.Element

export interface SvgMapViewerConfig {
  root: string
  map: string
  href: string
  width: number
  height: number
  fontSize: number
  origViewBox: BoxBox
  layout: Layout
  title: string
  subtitle: string
  copyright: string
  zoomFactor: number
  animationDuration: number
  dragStepAlpha: number
  dragStepStepLimit: number
  dragStepMaxCount: number
  scrollIdleTimeout: number
  zoomStartCbs: Set<ZoomStartCb>
  zoomEndCbs: Set<ZoomEndCb>
  searchStartCbs: Set<SearchCb>
  searchCbs: Set<SearchCb>
  searchDoneCbs: Set<SearchDoneCb>
  searchEndCbs: Set<SearchDoneCb>
  uiOpenCbs: Set<UiOpenCb>
  uiOpenDoneCbs: Set<UiOpenDoneCb>
  uiCloseCbs: Set<UiCloseCb>
  uiCloseDoneCbs: Set<UiCloseCb>
  renderMap: RenderMap
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
