/* eslint-disable functional/no-mixed-types */
import { type ReactNode } from 'react'

import { type BoxBox } from './lib/box/prefixed'
import { type OsmCartoConfig } from './lib/carto'
import {
  type OsmMapMarkers,
  type OsmMapObjects,
  type OsmMapPathOps,
  type OsmMapSymbols,
} from './lib/carto/types'
import {
  type MapCoord,
  type OsmMapData,
  type OsmMapMap,
} from './lib/geo/data-types'
import { type OsmSearchEntry } from './lib/geo/search-types'
import { type SearchPos } from './lib/search/types'
import { type Vec } from './lib/vec'
import { type Layout, type LayoutCoord } from './lib/viewer/layout/layout-types'

//// layout

export type Z = -1 | 1

export type Dir = -1 | 0 | 1

export type Scroll = null | BoxBox

export interface CurrentScroll {
  readonly scroll: BoxBox
  readonly client: Size
  readonly timeStamp: number
}

export interface HV {
  readonly h: Dir // -1 | 0 | 1 = left, none, right
  readonly v: Dir // -1 | 0 | 1 = top, none, bottom
  readonly th: number // angle (radian)
}

export interface Size {
  readonly width: number
  readonly height: number
}

export interface POI {
  readonly id: null | number
  readonly name: string | readonly string[]
  readonly coord: Vec
  readonly size: number
  readonly area?: number
  readonly fidx?: number
}

export interface Info {
  readonly title: string
}

export interface SearchSvgReq {
  readonly psvg: Vec
}

export interface SearchGeoReq {
  readonly pgeo: Vec
  readonly fidx: number
}

export interface SearchRes {
  readonly psvg: Vec
  readonly fidx: number
  readonly info: Readonly<Info>
}

export interface SearchData {
  readonly psvg: Vec
  readonly info: Readonly<Info>
  readonly layout: Readonly<LayoutCoord>
  readonly fidx: number
}

export interface LonLat {
  readonly lon: string
  readonly lat: string
}

export interface Range {
  readonly start: Vec
  readonly end: Vec
}

export interface AnimationMatrix {
  readonly matrix: Readonly<DOMMatrixReadOnly>
  readonly origin: null | Vec
}

export interface ZoomInfo {
  readonly layout: Readonly<LayoutCoord>
  readonly zoom: number
}

export type ZoomEndInfo = ZoomInfo

export interface Zoom {
  readonly z: Z
  readonly p: null | Vec
}

export interface ResizeInfo {
  readonly layout: Readonly<Layout>
  readonly force: boolean
}

export interface FloorImage {
  readonly fidx: number
  readonly url: string
  readonly buf?: ArrayBuffer // Blob.create
}

////

export interface OsmSearchProps {
  readonly mapData: Readonly<OsmMapData>
  readonly osmSearchEntries: readonly Readonly<OsmSearchEntry>[]
  readonly cartoConfig?: Readonly<OsmCartoConfig>
}

////

export type RenderAssets = () => ReactNode

export interface OsmRenderMapProps {
  readonly data: Readonly<OsmDataConfig>
  readonly render: Readonly<OsmRenderConfig>
  readonly carto?: Readonly<OsmCartoConfig>
  readonly floors?: Readonly<FloorsConfig>
}

export type OsmRenderMap = (props: Readonly<OsmRenderMapProps>) => ReactNode

export type OsmGetMapNames = (
  props: Readonly<OsmRenderMapProps>
) => readonly POI[]

export type OsmGetSearchEntries = (
  props: Readonly<OsmSearchProps>
) => readonly SearchPos[]

export type OsmGetSearchInfo = (
  res: Readonly<SearchPos>,
  mapMap?: Readonly<OsmMapMap>,
  entries?: readonly Readonly<OsmSearchEntry>[]
) => null | Info

export interface RenderInfoProps {
  readonly info: Info
}

export type RenderInfo = (props: Readonly<RenderInfoProps>) => ReactNode

////

export interface SvgMapViewerConfig
  extends OsmDataConfig, OsmRenderConfig, OsmSearchConfig {
  root: string
  href: string
  width: number
  height: number
  origViewBox: BoxBox // XXX
  origBoundingBox?: BoxBox // XXX
  fontSize: number
  backgroundColor?: string
  title: string
  subtitle: string
  copyright: string
  zoomFactor: number
  floorsConfig?: FloorsConfig
  uiConfig?: UiConfig
  isContainerRendered: () => boolean
  isUiRendered: () => boolean
}

export interface UiConfig {
  showGuides: boolean
}

export interface OsmDataConfig {
  readonly origViewBox: BoxBox // XXX
  readonly mapData: OsmMapData
  readonly mapMap: OsmMapMap
  readonly mapCoord: MapCoord
}

export interface OsmRenderConfig {
  readonly renderMap: OsmRenderMap
  readonly isMapRendered: () => boolean
  readonly getMapNames: OsmGetMapNames
  readonly getMapPaths: () => readonly Readonly<OsmMapPathOps>[]
  readonly getMapObjects: () => readonly Readonly<OsmMapObjects>[]
  readonly getMapSymbols: () => readonly Readonly<OsmMapSymbols>[]
  readonly getMapMarkers: () => readonly Readonly<OsmMapMarkers>[]
  readonly mapSvgStyle: string
  readonly cartoConfig?: OsmCartoConfig
}

export interface OsmSearchConfig {
  readonly osmSearchEntries: readonly Readonly<OsmSearchEntry>[] // XXX
  readonly getSearchEntries: OsmGetSearchEntries
  readonly getSearchInfo: OsmGetSearchInfo
  readonly renderInfo: RenderInfo
}

export interface Floor {
  readonly name: string
  readonly href: string | URL
}

export interface FloorsConfig {
  readonly floors: readonly Floor[]
  readonly initialFidx: number
}

export type SvgMapViewerConfigUser = Partial<SvgMapViewerConfig>
