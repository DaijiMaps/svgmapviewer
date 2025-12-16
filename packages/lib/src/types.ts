/* eslint-disable functional/no-mixed-types */
/* eslint-disable functional/no-return-void */
import { type ReactNode } from 'react'
import { type BoxBox } from './lib/box/prefixed'
import { type OsmCartoConfig } from './lib/carto'
import {
  type OsmMapLayer,
  type OsmMapMarkers,
  type OsmMapObjects,
  type OsmMapSymbols,
} from './lib/carto/types'
import { type SearchEntry } from './lib/geo/search-types'
import {
  type MapCoord,
  type OsmMapData,
  type OsmMapMap,
} from './lib/geo/data-types'
import { type POI } from './lib/geo/poi-types'
import { type Vec } from './lib/vec'
import { type Layout, type LayoutCoord } from './lib/viewer/layout-types'
import { type ViewerMode } from './lib/viewer/viewer-types'
import {
  type AddressEntries,
  type SearchAddressRes,
} from './lib/search/address-types'
import { type Cb, type Cb1 } from './lib/cb'

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

export type ZoomStartCb = Cb1<Readonly<ZoomInfo>>
export type ZoomEndCb = Cb1<Readonly<ZoomEndInfo>>
export type SearchStartCb = Cb1<Vec>
export type SearchCb = Cb1<Vec>
export type SearchDoneCb = Cb1<Readonly<null | SearchRes>>
export type SearchEndCb = Cb1<Readonly<null | SearchRes>>
export type SearchEndDoneCb = Cb1<Readonly<SearchData>>
export type UiOpenCb = Cb1<Vec>
export type UiOpenDoneCb = Cb1<boolean>
export type UiCloseCb = Cb
export type UiCloseDoneCb = () => void
export type ResizeCb = Cb1<Readonly<ResizeInfo>>
export type LayoutCb = Cb1<Readonly<ResizeInfo>>
export type AnimationCb = Cb1<Readonly<null | AnimationMatrix>>
export type ModeCb = Cb1<ViewerMode>
export type FloorCb = Cb1<number>

export type GeoLocCb = Cb
export type GeoLocDoneCb = Cb1<Readonly<GeolocationPosition>>

////

export interface OsmSearchProps {
  mapData: Readonly<OsmMapData>
  searchEntries: readonly SearchEntry[]
  cartoConfig?: Readonly<OsmCartoConfig>
}

////

export type RenderAssets = () => ReactNode

export interface OsmRenderMapProps {
  data: Readonly<OsmDataConfig>
  render: Readonly<OsmRenderConfig>
  carto?: Readonly<OsmCartoConfig>
  floors?: Readonly<FloorsConfig>
}

export type RenderMap = (props: Readonly<OsmRenderMapProps>) => ReactNode

export type GetMapNames = (props: Readonly<OsmRenderMapProps>) => readonly POI[]
export type GetAddressEntries = (
  props: Readonly<OsmSearchProps>
) => AddressEntries
export type GetAddressInfo = (
  mapMap: Readonly<OsmMapMap>,
  entries: readonly SearchEntry[],
  res: Readonly<SearchAddressRes>
) => null | Info

export type RenderInfo = (props: Readonly<{ info: Info }>) => ReactNode

////

export interface SvgMapViewerConfig
  extends OsmDataConfig, OsmRenderConfig, OsmSearchConfig {
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
  cartoConfig?: OsmCartoConfig
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
  renderMap: RenderMap
  isMapRendered: () => boolean
  getMapNames: GetMapNames
  getMapLayers: () => readonly OsmMapLayer[]
  getMapObjects: () => readonly OsmMapObjects[]
  getMapSymbols: () => readonly OsmMapSymbols[]
  getMapMarkers: () => readonly OsmMapMarkers[]
  mapSvgStyle: string
}

export interface OsmSearchConfig {
  searchEntries: readonly SearchEntry[] // XXX
  getAddressEntries: GetAddressEntries
  getAddressInfo: GetAddressInfo
  renderInfo: RenderInfo
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
