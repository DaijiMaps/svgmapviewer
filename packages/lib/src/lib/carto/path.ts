/* eslint-disable functional/functional-parameters */
import { svgMapViewerConfig as cfg } from '../../config'
import {
  type Line,
  type LineFeature,
  lineToPathD2,
  type MultiPolygon,
  type MultiPolygonFeature,
  multiPolygonToPathD2,
  type OsmLineProperties,
  type OsmPolygonProperties,
} from '../geo'

export function renderAreasPath2(m: DOMMatrixReadOnly): string {
  const xs: MultiPolygon[] = cfg.mapData.areas.features.map(
    (f) => f.geometry.coordinates
  ) as unknown as MultiPolygon[]

  return xs.map(multiPolygonToPathD2(m)).join('')
}

export function renderLinePath2(
  filter: (f: Readonly<LineFeature<OsmLineProperties>>) => boolean,
  m: DOMMatrixReadOnly
): string {
  const xs: Line[] = cfg.mapData.lines.features
    .filter(filter)
    .map((f) => f.geometry.coordinates) as unknown as Line[]

  return xs.map(lineToPathD2(m)).join('')
}

export function renderMultiPolygonPath2(
  filter: (f: Readonly<MultiPolygonFeature<OsmPolygonProperties>>) => boolean,
  m: DOMMatrixReadOnly
): string {
  const xs: MultiPolygon[] = cfg.mapData.multipolygons.features
    .filter(filter)
    .map((f) => f.geometry.coordinates) as unknown as MultiPolygon[]

  return xs.map(multiPolygonToPathD2(m)).join('')
}
