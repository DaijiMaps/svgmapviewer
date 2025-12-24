import type { ReactNode } from 'react'
import type { OsmLineFeature, OsmMultiPolygonFeature } from '../geo/osm-types'
import type { Line, MultiPolygon } from '../geo/path-types'
import type { MapPathOps } from './types'

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

////

type GetFeature<L extends MapPathOps> = L['type'] extends 'line'
  ? OsmLineFeature
  : OsmMultiPolygonFeature

export type GetOp<L extends MapPathOps> = L['type'] extends 'line'
  ? LinePath
  : MultiPolygonPath

export type GetOps<L extends MapPathOps> = readonly GetOp<L>[]

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
