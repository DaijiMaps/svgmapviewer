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

export function MultiPolygonPathsToPath(
  features: Readonly<OsmMultiPolygonFeatures>,
  m: DOMMatrixReadOnly,
  layer: Readonly<MapMultiPolygonPathOps>
): ReactNode {
  const xs: MultiPolygonPaths = multiPolygonLayerToMultiPolygonPaths(
    features,
    layer
  )
  return (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>{MultiPolygonPathToPath(x, m, layer)}</Fragment>
      ))}
    </g>
  )
}

function MultiPolygonPathToPath(
  { id, tags, width, widthScale, vs }: Readonly<MultiPolygonPath>,
  m: DOMMatrixReadOnly,
  {
    name: layerName,
    width: defaultStrokeWidth,
    widthScale: defaultStrokeWidthScale,
  }: Readonly<MapMultiPolygonPathOps>
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

function multiPolygonLayerToMultiPolygonPaths(
  features: OsmMultiPolygonFeatures,
  layer: Readonly<MapMultiPolygonPathOps>
): MultiPolygonPaths {
  return layer.filter !== undefined
    ? getMultiPolygons(features, layer.filter)
    : layer.data !== undefined
      ? layer
          .data()
          .map(
            (vs) => ({ type: 'multipolygon', tags: [], vs }) as MultiPolygonPath
          )
      : []
}

export function getMultiPolygons(
  features: OsmMultiPolygonFeatures,
  filter: MultiPolygonsFilter
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
