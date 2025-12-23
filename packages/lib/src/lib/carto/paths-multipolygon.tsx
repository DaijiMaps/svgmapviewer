import type { ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { undefinedIfNull } from '../../utils'
import { getOsmId, multiPolygonToPathD, type MultiPolygonsFilter } from '../geo'
import type { OsmMultiPolygonFeatures } from '../geo/osm-types'
import { propertiesToTags, propertiesToWidth } from './properties'
import type { MapMultiPolygonPathOps, MultiPolygonPath } from './types'

export function MultiPolygonPathsToPath(
  features: Readonly<OsmMultiPolygonFeatures>,
  m: DOMMatrixReadOnly,
  layer: Readonly<MapMultiPolygonPathOps>
): ReactNode {
  const xs: readonly MultiPolygonPath[] = multiPolygonLayerToMultiPolygonPaths(
    features,
    layer
  )
  return xs.length === 0 ? (
    <></>
  ) : (
    <g className={layer.name}>
      {xs.map((x, idx) => (
        <Fragment key={idx}>
          {MultiPolygonPathToPath(
            m,
            x,
            layer.name,
            layer.width,
            layer.widthScale
          )}
        </Fragment>
      ))}
    </g>
  )
}

function MultiPolygonPathToPath(
  m: DOMMatrixReadOnly,
  { id, tags, width, widthScale, vs }: Readonly<MultiPolygonPath>,
  layerName: string,
  defaultStrokeWidth?: number,
  defaultStrokeWidthScale?: number
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
) {
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
): readonly MultiPolygonPath[] {
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
