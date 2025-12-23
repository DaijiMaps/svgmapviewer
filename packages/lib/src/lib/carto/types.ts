/* eslint-disable functional/no-mixed-types */
import type { ReactNode } from 'react'
import {
  type LineFeature,
  type MultiPolygonGeoJSON,
  type PointFeature,
  type PolygonFeature,
} from '../geo'
import type { OsmLineFeature, OsmMultiPolygonFeature } from '../geo/osm-types'
import { type Line, type MultiPolygon, type Point } from '../geo/path-types'
import {
  type LinesFilter,
  type MultiPolygonsFilter,
  type PointsFilter,
} from '../geo/poi-types'

//// paths

export type MapPathOps = MapLinePathOps | MapMultiPolygonPathOps

export type OsmMapPathOps = MapPathOps | readonly MapPathOps[]

export interface MapLinePathOps {
  readonly type: 'line'
  readonly name: string
  readonly width?: number
  readonly widthScale?: number
  readonly filter?: LinesFilter
  readonly data?: () => readonly Line[]
}

export interface MapMultiPolygonPathOps {
  readonly type: 'multipolygon'
  readonly name: string
  readonly width?: number
  readonly widthScale?: number
  readonly filter?: MultiPolygonsFilter
  readonly data?: () => readonly MultiPolygon[]
}

////

export interface LinePath {
  readonly type: 'line'
  readonly name?: string
  readonly id?: string
  readonly tags: readonly string[]
  readonly width?: number
  readonly widthScale?: number
  readonly vs: Line
}

export interface MultiPolygonPath {
  readonly type: 'multipolygon'
  readonly name?: string
  readonly id?: string
  readonly tags: readonly string[]
  readonly width?: number
  readonly widthScale?: number
  readonly vs: MultiPolygon
}

export type LinePaths = readonly LinePath[]
export type MultiPolygonPaths = readonly MultiPolygonPath[]

//// markers

export interface RenderMapMarkersProps {
  readonly m: DOMMatrixReadOnly
  readonly mapMarkers: readonly OsmMapMarkers[]
  readonly fontSize: number
  readonly s: number
}

export interface MapMarker {
  readonly name: string
  readonly href: string
  readonly data?: Point
}

export interface OsmMapMarkers extends WithFilters {
  readonly name: string
}

//// objects

// XXX take size (width/height)
// XXX calc stroke-width (0.05% of width/height)
export interface OsmMapObjects extends WithFilters {
  readonly name: string
  readonly path: string
  readonly width: number
}

//// symbols

export interface RenderMapSymbolsProps {
  readonly m: DOMMatrixReadOnly
  readonly mapSymbols: readonly OsmMapSymbols[]
}

export interface OsmMapSymbols extends WithFilters {
  readonly name: string
  readonly href: string
}

//// common

export interface WithFilters {
  readonly pointsFilter?: PointsFilter
  readonly linesFilter?: LinesFilter
  readonly polygonsFilter?: MultiPolygonsFilter
  readonly data?: readonly Point[]
}

export interface WithFeatures<P = object> {
  readonly pointFeatures: readonly PointFeature<P>[]
  readonly lineFeatures: readonly LineFeature<P>[]
  readonly polygonFeatures: readonly PolygonFeature<P>[]
}

////

type GetFeature<L extends MapPathOps> = L['type'] extends 'line'
  ? OsmLineFeature
  : OsmMultiPolygonFeature

type GetOp<L extends MapPathOps> = L['type'] extends 'line'
  ? LinePath
  : MultiPolygonPath

type GetOps<L extends MapPathOps> = readonly GetOp<L>[]

type GetCoordinate<L extends MapPathOps> =
  GetFeature<L>['geometry']['coordinates']

type RenderPaths<L extends MapPathOps> = (
  layer: Readonly<L>,
  m: DOMMatrixReadOnly,
  features: readonly GetFeature<L>[]
) => ReactNode

type LayerToPaths<L extends MapPathOps> = (
  layer: L,
  features: readonly GetFeature<L>[]
) => GetOps<L>

type RenderPath<L extends MapPathOps> = (
  layer: L,
  m: DOMMatrixReadOnly,
  ops: Readonly<GetOp<L>>
) => ReactNode

type ToPathD<L extends MapPathOps> = (
  m: DOMMatrixReadOnly
) => (vs: GetCoordinate<L>) => string

export interface PathOps<L extends MapPathOps> {
  renderPaths: RenderPaths<L>
  layerToPaths: LayerToPaths<L>
  renderPath: RenderPath<L>
  toPathD: ToPathD<L>
}

////

export interface OsmCartoConfig {
  readonly backgroundColor?: string
  readonly mapSvgStyle?: string

  readonly internals?: MultiPolygonGeoJSON

  readonly skipNamePattern?: RegExp
  readonly splitNamePattern?: RegExp

  readonly filterLabelsByRange?: boolean
}
