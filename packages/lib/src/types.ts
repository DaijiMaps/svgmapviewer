/* eslint-disable functional/no-mixed-types */
/* eslint-disable functional/no-return-void */
import { type ReactNode } from 'react'
import { type BoxBox } from './lib/box/prefixed'
import type { CartoConfig } from './lib/carto'
import {
  type MapLayer,
  type MapMarkers,
  type MapObjects,
  type MapSymbols,
} from './lib/carto/types'
import type { SearchEntry } from './lib/geo'
import { type MapCoord, type MapData, type MapMap } from './lib/geo/data-types'
import { type POI } from './lib/geo/poi-types'
import { type Vec } from './lib/vec'
import { type Layout, type LayoutCoord } from './lib/viewer/layout-types'
import type { ViewerMode } from './lib/viewer/viewer-types'

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

////

export type Cb = () => void
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
export type AnimationCb = (animation: null | AnimationMatrix) => void
export type ModeCb = (mode: ViewerMode) => void
export type FloorCb = (fidx: number) => void

export type GeoLocCb = () => void
export type GeoLocDoneCb = (position: GeolocationPosition) => void

////

export type RenderAssets = () => ReactNode

export interface RenderMapProps {
  data: Readonly<DataConfig>
  render: Readonly<RenderConfig>
  carto?: Readonly<CartoConfig>
  floors?: Readonly<FloorsConfig>
}

export type RenderMap = (props: Readonly<RenderMapProps>) => ReactNode

export type RenderInfo = (props: Readonly<{ info: Info }>) => ReactNode

////

export interface SvgMapViewerConfig extends DataConfig, RenderConfig {
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

export interface DataConfig {
  mapData: MapData
  mapMap: MapMap
  mapCoord: MapCoord
  origViewBox: BoxBox
}

export interface RenderConfig {
  map: string
  getMapLayers: () => MapLayer[]
  getMapObjects: () => MapObjects[]
  getMapSymbols: () => MapSymbols[]
  getMapMarkers: () => MapMarkers[]
  getMapNames: () => POI[] // XXX
  searchEntries: SearchEntry[]
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
  floors: Floor[]
  fidx: number
}

export type SvgMapViewerConfigUser = Partial<SvgMapViewerConfig>
