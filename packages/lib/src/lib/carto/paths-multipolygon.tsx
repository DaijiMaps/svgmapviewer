import type { ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { undefinedIfNull } from '../../utils'
import { getOsmId, multiPolygonToPathD, type MultiPolygonsFilter } from '../geo'
import type { OsmMultiPolygonFeatures } from '../geo/osm-types'
import { propertiesToTags, propertiesToWidth } from './properties'
import type {
  MapMultiPolygonPathOps,
  MultiPolygonPath,
  MultiPolygonPaths,
} from './types'

interface MultiPolygonOps {
  renderPaths(
    layer: Readonly<MapMultiPolygonPathOps>,
    m: DOMMatrixReadOnly,
    features: Readonly<OsmMultiPolygonFeatures>
  ): ReactNode
}

export const multiPolygonOps: MultiPolygonOps = {
  renderPaths,
}

export function renderPaths(
  layer: Readonly<MapMultiPolygonPathOps>,
  m: DOMMatrixReadOnly,
  features: Readonly<OsmMultiPolygonFeatures>
): ReactNode {
  const xs: MultiPolygonPaths = layerToPaths(layer, features)
  return (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>{MultiPolygonPathToPath(layer, m, x)}</Fragment>
      ))}
    </g>
  )
}

function layerToPaths(
  layer: Readonly<MapMultiPolygonPathOps>,
  features: OsmMultiPolygonFeatures
): MultiPolygonPaths {
  return layer.filter !== undefined
    ? getPaths(layer.filter, features)
    : layer.data !== undefined
      ? layer
          .data()
          .map(
            (vs) => ({ type: 'multipolygon', tags: [], vs }) as MultiPolygonPath
          )
      : []
}

export function getPaths(
  filter: MultiPolygonsFilter,
  features: OsmMultiPolygonFeatures
): MultiPolygonPaths {
  return features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      type: 'multipolygon',
      name: undefinedIfNull(f.properties.name),
      id: getOsmId(f.properties) + '',
      tags: propertiesToTags(f.properties),
      width: propertiesToWidth(f.properties),
      vs: f.geometry.coordinates,
    }))
}

////

function MultiPolygonPathToPath(
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
      d={multiPolygonToPathD(m)(vs)}
    />
  )
}
