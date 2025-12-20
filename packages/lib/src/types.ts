/* eslint-disable functional/no-mixed-types */
import { type ReactNode } from 'react'
import { type BoxBox } from './lib/box/prefixed'
import { type OsmCartoConfig } from './lib/carto'
import {
  type OsmMapLayer,
  type OsmMapMarkers,
  type OsmMapObjects,
  type OsmMapSymbols,
} from './lib/carto/types'
import { type OsmSearchEntry } from './lib/geo/search-types'
import {
  type MapCoord,
  type OsmMapData,
  type OsmMapMap,
} from './lib/geo/data-types'
import { type Vec } from './lib/vec'
import { type Layout, type LayoutCoord } from './lib/viewer/layout-types'
import { type SearchEntries, type SearchPos } from './lib/search/types'

//// layout

export type Z = -1 | 0 | 1

export type Scroll = null | BoxBox

export interface HV {
  h: Z // -1 | 0 | 1 = left, none, right
  v: Z // -1 | 0 | 1 = top, none, bottom
  th: number // angle (radian)
}

export interface Size {
  width: number
  height: number
}

export interface POI {
  id: null | number
  name: string | readonly string[]
  pos: Vec
  size: number
  area?: number
  fidx?: number
}

export interface Info {
  title: string
}

export interface SearchReq {
  psvg: Vec
  fidx: number
}

export interface SearchGeoReq {
  pgeo: Vec
  fidx: number
}

export interface SearchRes {
  psvg: Vec
  info: Readonly<Info>
}

export interface SearchData {
  psvg: Vec
  info: Readonly<Info>
  layout: Readonly<LayoutCoord>
  fidx: number
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
  readonly matrix: Readonly<DOMMatrixReadOnly>
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

export interface OsmSearchProps {
  mapData: Readonly<OsmMapData>
  osmSearchEntries: readonly Readonly<OsmSearchEntry>[]
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

export type OsmRenderMap = (props: Readonly<OsmRenderMapProps>) => ReactNode

export type OsmGetMapNames = (
  props: Readonly<OsmRenderMapProps>
) => readonly POI[]

export type OsmGetSearchEntries = (
  props: Readonly<OsmSearchProps>
) => SearchEntries

export type OsmGetSearchInfo = (
  res: Readonly<SearchPos>,
  mapMap?: Readonly<OsmMapMap>,
  entries?: readonly Readonly<OsmSearchEntry>[]
) => null | Info

export interface RenderInfoProps {
  info: Info
}

export type RenderInfo = (props: Readonly<RenderInfoProps>) => ReactNode

////

export interface SvgMapViewerConfig
  extends OsmDataConfig, OsmRenderConfig, OsmSearchConfig, FloorsRenderConfig {
  root: string
  href: string
  width: number
  height: number
  origViewBox: BoxBox // XXX
  fontSize: number
  backgroundColor?: string
  title: string
  subtitle: string
  copyright: string
  zoomFactor: number
  uiConfig?: UiConfig
  isContainerRendered: () => boolean
  isUiRendered: () => boolean
}

export interface UiConfig {
  showGuides: boolean
}

export interface OsmDataConfig {
  origViewBox: BoxBox // XXX
  mapData: OsmMapData
  mapMap: OsmMapMap
  mapCoord: MapCoord
}

export interface OsmRenderConfig {
  renderMap: OsmRenderMap
  isMapRendered: () => boolean
  getMapNames: OsmGetMapNames
  getMapLayers: () => readonly Readonly<OsmMapLayer>[]
  getMapObjects: () => readonly Readonly<OsmMapObjects>[]
  getMapSymbols: () => readonly Readonly<OsmMapSymbols>[]
  getMapMarkers: () => readonly Readonly<OsmMapMarkers>[]
  mapSvgStyle: string
  cartoConfig?: OsmCartoConfig
}

export interface OsmSearchConfig {
  osmSearchEntries: readonly Readonly<OsmSearchEntry>[] // XXX
  getSearchEntries: OsmGetSearchEntries
  getSearchInfo: OsmGetSearchInfo
  renderInfo: RenderInfo
}

export interface FloorsRenderConfig {
  floorsConfig?: FloorsConfig
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
