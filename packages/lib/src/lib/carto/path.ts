/* eslint-disable functional/functional-parameters */
import { svgMapViewerConfig as cfg } from '../../config'
import {
  type Line,
  type LineFeature,
  lineToPathD,
  type MultiPolygon,
  type MultiPolygonFeature,
  multiPolygonToPathD,
  type OsmLineProperties,
  type OsmPolygonProperties,
} from '../geo'

export function renderAreasPath(): string {
  const xs: MultiPolygon[] = cfg.mapData.areas.features.map(
    (f) => f.geometry.coordinates
  ) as unknown as MultiPolygon[]

  return xs.map(multiPolygonToPathD).join('')
}

export function renderLinePath(
  filter: (f: Readonly<LineFeature<OsmLineProperties>>) => boolean
): string {
  const xs: Line[] = cfg.mapData.lines.features
    .filter(filter)
    .map((f) => f.geometry.coordinates) as unknown as Line[]

  return xs.map(lineToPathD).join('')
}

export function renderMultiPolygonPath(
  filter: (f: Readonly<MultiPolygonFeature<OsmPolygonProperties>>) => boolean
): string {
  const xs: MultiPolygon[] = cfg.mapData.multipolygons.features
    .filter(filter)
    .map((f) => f.geometry.coordinates) as unknown as MultiPolygon[]

  return xs.map(multiPolygonToPathD).join('')
}
