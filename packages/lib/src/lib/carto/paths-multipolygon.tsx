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
  layer: Readonly<MapMultiPolygonPathOps>,
  m: DOMMatrixReadOnly,
  features: Readonly<OsmMultiPolygonFeatures>
): ReactNode {
  const xs: MultiPolygonPaths = multiPolygonLayerToMultiPolygonPaths(
    layer,
    features
  )
  return (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>{MultiPolygonPathToPath(layer, m, x)}</Fragment>
      ))}
    </g>
  )
}

function multiPolygonLayerToMultiPolygonPaths(
  layer: Readonly<MapMultiPolygonPathOps>,
  features: OsmMultiPolygonFeatures
): MultiPolygonPaths {
  return layer.filter !== undefined
    ? getMultiPolygons(layer.filter, features)
    : layer.data !== undefined
      ? layer
          .data()
          .map(
            (vs) => ({ type: 'multipolygon', tags: [], vs }) as MultiPolygonPath
          )
      : []
}

export function getMultiPolygons(
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
