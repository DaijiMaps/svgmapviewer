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
