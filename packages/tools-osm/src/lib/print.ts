import { Doc } from '@effect/printer'
import { printGeoJSON } from './geojson-print'
import type { _GeoJSON } from './geojson-types'

export function printGeoJsonAsTs(
  filename: string,
  typename: string,
  geojson: Readonly<_GeoJSON>
): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(`import { type ${typename} } from "svgmapviewer/geo"`),
    Doc.hcat([
      Doc.text(`export const ${filename}: ${typename} = `),
      printGeoJSON(geojson),
    ]),
    Doc.text(`export default ${filename}`),
  ])
}

// eslint-disable-next-line functional/functional-parameters
export function printAllTs(): Doc.Doc<never> {
  return Doc.text(`
import areas from './areas'
import internals from './internals'
import lines from './map-lines'
import multilinestrings from './map-multilinestrings'
import multipolygons from './map-multipolygons'
import points from './map-points'
import measures from './measures'
import origin from './origin'
import viewbox from './viewbox'

export const mapData = {
  areas,
  internals,
  origin,
  measures,
  viewbox,
  points,
  lines,
  multilinestrings,
  multipolygons,
}
`)
}
