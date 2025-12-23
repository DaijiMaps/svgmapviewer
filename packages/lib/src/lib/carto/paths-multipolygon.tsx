import type { ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { undefinedIfNull } from '../../utils'
import { getOsmId, multiPolygonToPathD } from '../geo'
import type { OsmMultiPolygonFeatures } from '../geo/osm-types'
import { getPathsByData } from './path-common'
import { propertiesToTags, propertiesToWidth } from './properties'
import type {
  MapMultiPolygonPathOps,
  MultiPolygonPath,
  MultiPolygonPaths,
  PathOps,
} from './types'

type MultiPolygonOps = PathOps<MapMultiPolygonPathOps>

export const multiPolygonOps: MultiPolygonOps = {
  renderPaths,
  layerToPaths,
  renderPath,
  toPathD: multiPolygonToPathD,
}

export function renderPaths(
  layer: Readonly<MapMultiPolygonPathOps>,
  m: DOMMatrixReadOnly,
  features: Readonly<OsmMultiPolygonFeatures>
): ReactNode {
  const xs: MultiPolygonPaths = multiPolygonOps.layerToPaths(layer, features)
  return (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>{multiPolygonOps.renderPath(layer, m, x)}</Fragment>
      ))}
    </g>
  )
}

function layerToPaths(
  layer: Readonly<MapMultiPolygonPathOps>,
  features: OsmMultiPolygonFeatures
): MultiPolygonPaths {
  return [...getPathsByFilter(layer, features), ...getPathsByData(layer)]
}

export function getPathsByFilter(
  { type, filter }: Readonly<MapMultiPolygonPathOps>,
  features: OsmMultiPolygonFeatures
): MultiPolygonPaths {
  return filter
    ? features
        .filter((f) => filter(f.properties))
        .map((f) => ({
          type,
          name: undefinedIfNull(f.properties.name),
          id: getOsmId(f.properties) + '',
          tags: propertiesToTags(f.properties),
          width: propertiesToWidth(f.properties),
          vs: f.geometry.coordinates,
        }))
    : []
}

/*
export function getPathsByData({
  type,
  data,
}: Readonly<MapMultiPolygonPathOps>): MultiPolygonPaths {
  return data
    ? data().map((vs) => ({ type, tags: [], vs }) as MultiPolygonPath)
    : []
}
*/

////

function renderPath(
  {
    name: layerName,
    width: defaultStrokeWidth,
    widthScale: defaultStrokeWidthScale,
  }: Readonly<MapMultiPolygonPathOps>,
  m: DOMMatrixReadOnly,
  { id, tags, width, widthScale, vs }: Readonly<MultiPolygonPath>
): ReactNode {
  return (
    <path
      id={id}
      className={[layerName, ...tags].join(' ').replaceAll(/;/g, '_')} // XXX level=0;1
      strokeWidth={
        (width ?? defaultStrokeWidth ?? 1) *
        (widthScale ?? defaultStrokeWidthScale ?? 1)
      }
      d={multiPolygonOps.toPathD(m)(vs)}
    />
  )
}
