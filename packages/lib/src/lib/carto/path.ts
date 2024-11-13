import { svgMapViewerConfig as cfg } from '../config'
import {
  Line,
  LineFeature,
  lineToPath,
  MultiPolygon,
  MultiPolygonFeature,
  multiPolygonToPath,
  OsmLineProperties,
  OsmPolygonProperties,
} from '../geo'

export function renderAreasPath(): string {
  const xs: MultiPolygon[] = cfg.mapData.areas.features.map(
    (f) => f.geometry.coordinates
  ) as unknown as MultiPolygon[]

  return xs.map(multiPolygonToPath).join('')
}

export function renderLinePath(
  filter: (f: Readonly<LineFeature<OsmLineProperties>>) => boolean
): string {
  const xs: Line[] = cfg.mapData.lines.features
    .filter(filter)
    .map((f) => f.geometry.coordinates) as unknown as Line[]

  return xs.map(lineToPath).join('')
}

export function renderMultipolygonPath(
  filter: (f: Readonly<MultiPolygonFeature<OsmPolygonProperties>>) => boolean
): string {
  const xs: MultiPolygon[] = cfg.mapData.multipolygons.features
    .filter(filter)
    .map((f) => f.geometry.coordinates) as unknown as MultiPolygon[]

  return xs.map(multiPolygonToPath).join('')
}
