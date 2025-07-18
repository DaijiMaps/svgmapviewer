import type { MultiPolygonGeoJSON } from '../geo'
import { type Line, type MultiPolygon, type Point } from '../geo/path-types'
import {
  type LinesFilter,
  type MultiPolygonsFilter,
  type PointsFilter,
} from '../geo/poi-types'

//// layers

export type MapLayer = MapLineLayer | MapMultiPolygonLayer

export interface MapLineLayer {
  type: 'line'
  name: string
  width?: number
  widthScale?: number
  filter?: LinesFilter
  data?: Line[]
}

export interface MapMultiPolygonLayer {
  type: 'multipolygon'
  name: string
  width?: number
  widthScale?: number
  filter?: MultiPolygonsFilter
  data?: MultiPolygon[]
}

export interface LinePath {
  name?: string
  id?: string
  tags: string[]
  width?: number
  widthScale?: number
  vs: Line
}

export interface MultiPolygonPath {
  name?: string
  id?: string
  tags: string[]
  width?: number
  widthScale?: number
  vs: MultiPolygon
}
//// markers

export interface RenderMapMarkersProps {
  m: DOMMatrixReadOnly
  mapMarkers: MapMarkers[]
  fontSize: number
  s: number
}

export interface MapMarker {
  name: string
  href: string
  data?: Point
}

export interface MapMarkers extends WithFilters {
  name: string
}

//// objects

// XXX take size (width/height)
// XXX calc stroke-width (0.05% of width/height)
export interface MapObjects extends WithFilters {
  name: string
  path: string
  width: number
}

//// symbols

export interface RenderMapSymbolsProps {
  m: DOMMatrixReadOnly
  mapSymbols: MapSymbols[]
}

export interface MapSymbols extends WithFilters {
  name: string
  href: string
}

//// common

export interface WithFilters {
  pointsFilter?: PointsFilter
  linesFilter?: LinesFilter
  polygonsFilter?: MultiPolygonsFilter
  data?: Point[]
}

////

export interface CartoConfig {
  backgroundColor?: string
  mapSvgStyle?: string

  internals?: MultiPolygonGeoJSON

  skipNamePattern?: RegExp
  splitNamePattern?: RegExp
}
