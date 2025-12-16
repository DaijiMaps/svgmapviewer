/* eslint-disable functional/no-mixed-types */
/* eslint-disable functional/no-return-void */
import { type ReactNode } from 'react'
import { type BoxBox } from './lib/box/prefixed'
import type { CartoConfig } from './lib/carto'
import {
  type OsmMapLayer,
  type OsmMapMarkers,
  type OsmMapObjects,
  type OsmMapSymbols,
} from './lib/carto/types'
import type { SearchEntry } from './lib/geo'
import {
  type MapCoord,
  type OsmMapData,
  type OsmMapMap,
} from './lib/geo/data-types'
import { type POI } from './lib/geo/poi-types'
import { type Vec } from './lib/vec'
import { type Layout, type LayoutCoord } from './lib/viewer/layout-types'
import type { ViewerMode } from './lib/viewer/viewer-types'
import type { AddressEntries } from './lib/search'

//// layout

export interface HV {
  h: -1 | 0 | 1 // left, none, right
  v: -1 | 0 | 1 // top, none, bottom
  th: number // angle (radian)
}

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

export interface SearchData {
  psvg: Vec
  info: Readonly<Info>
  layout: Readonly<LayoutCoord>
}

export interface LonLat {
  lon: string
  lat: string
}

export interface Range {
  start: Vec
  end: Vec
}

export interface AnimationMatrix {
  readonly matrix: DOMMatrixReadOnly
  readonly origin: null | Vec
}

export interface ZoomInfo {
  layout: Readonly<LayoutCoord>
  zoom: number
  z: number
}

export type ZoomEndInfo = Omit<ZoomInfo, 'z'>

export interface ResizeInfo {
  layout: Readonly<Layout>
  force: boolean
}

////

export type Cb = () => void
export type ZoomStartCb = (zoom: Readonly<ZoomInfo>) => void
export type ZoomEndCb = (end: Readonly<ZoomEndInfo>) => void
export type SearchStartCb = (psvg: Vec) => void
export type SearchCb = (psvg: Vec) => void
export type SearchDoneCb = (res: Readonly<null | SearchRes>) => void
export type SearchEndCb = (res: Readonly<null | SearchRes>) => void
export type SearchEndDoneCb = (data: Readonly<SearchData>) => void
export type UiOpenCb = (psvg: Vec) => void
export type UiOpenDoneCb = (ok: boolean) => void
export type UiCloseCb = () => void
export type UiCloseDoneCb = () => void
export type ResizeCb = (resize: Readonly<ResizeInfo>) => void
export type LayoutCb = (resize: Readonly<ResizeInfo>) => void
export type AnimationCb = (animation: Readonly<null | AnimationMatrix>) => void
export type ModeCb = (mode: ViewerMode) => void
export type FloorCb = (fidx: number) => void

export type GeoLocCb = () => void
export type GeoLocDoneCb = (position: Readonly<GeolocationPosition>) => void

////

export interface OsmSearchProps {
  mapData: Readonly<OsmMapData>
  searchEntries: readonly SearchEntry[]
  cartoConfig?: Readonly<CartoConfig>
}

////

export type RenderAssets = () => ReactNode

export interface OsmRenderMapProps {
  data: Readonly<OsmDataConfig>
  render: Readonly<OsmRenderConfig>
  carto?: Readonly<CartoConfig>
  floors?: Readonly<FloorsConfig>
}

export type RenderMap = (props: Readonly<OsmRenderMapProps>) => ReactNode

export type RenderInfo = (props: Readonly<{ info: Info }>) => ReactNode

////

export interface SvgMapViewerConfig extends OsmDataConfig, OsmRenderConfig {
  root: string
  href: string
  width: number
  height: number
  fontSize: number
  backgroundColor?: string
  title: string
  subtitle: string
  copyright: string
  zoomFactor: number
  uiConfig?: UiConfig
  cartoConfig?: CartoConfig
  floorsConfig?: FloorsConfig
  isContainerRendered: () => boolean
  isUiRendered: () => boolean
}

export interface UiConfig {
  showGuides: boolean
}

export interface OsmDataConfig {
  mapData: OsmMapData
  mapMap: OsmMapMap
  mapCoord: MapCoord
  origViewBox: BoxBox
}

export interface OsmRenderConfig {
  getMapLayers: () => readonly OsmMapLayer[]
  getMapObjects: () => readonly OsmMapObjects[]
  getMapSymbols: () => readonly OsmMapSymbols[]
  getMapMarkers: () => readonly OsmMapMarkers[]
  getMapNames: (props: Readonly<OsmRenderMapProps>) => readonly POI[] // XXX
  getAddressEntries: (props: Readonly<OsmSearchProps>) => AddressEntries // XXX
  searchEntries: readonly SearchEntry[] // XXX
  renderInfo: RenderInfo
  mapSvgStyle: string
  renderMap: RenderMap
  isMapRendered: () => boolean
}

export interface Floor {
  name: string
  href: string
}

export interface FloorsConfig {
  floors: readonly Floor[]
  fidx: number
}

export type SvgMapViewerConfigUser = Partial<SvgMapViewerConfig>
