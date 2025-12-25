import { Doc } from '@effect/printer'
import { printGeoJSON } from './geojson-print'
import type { _GeoJSON } from './geojson-types'

export function printGeoJsonAsTs(
  filename: Names,
  geojson: Readonly<_GeoJSON>
): string {
  const _type = typeNames[filename]

  const doc = Doc.vsep([
    Doc.text(`import { LineGeoJSON } from "svgmapviewer/geo"`),
    Doc.line,
    Doc.text(`export const ${filename}: ${_type} = `),
    printGeoJSON(geojson),
    Doc.line,
    Doc.text(`export const `),
  ])
  return Doc.render(doc, { style: 'pretty' })
}

const typeNames = {
  areas: 'MultiPolygonGeoJSON',
  internals: 'MultiPolygonGeoJSON',
  origin: 'PointGeoJSON',
  measures: 'LineGeoJSON<MeasureProperties>',
  viewbox: 'LineGeoJSON',

  'map-points': 'OsmPointGeoJSON',
  'map-lines': 'OsmLineGeoJSON',
  'map-multilinestrings': 'OsmMultiLineStringGeoJSON',
  'map-multipolygons': 'OsmMultiPolygonGeoJSON',
}

type Names = keyof typeof typeNames
