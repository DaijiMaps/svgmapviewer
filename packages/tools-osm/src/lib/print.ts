/* eslint-disable @typescript-eslint/no-unused-vars */
import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Doc } from '@effect/printer'
import { Effect, Record } from 'effect'
import { printGeoJSON } from './geojson-print'
import { decodeGeoJSON } from './geojson-schema'
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
  return Doc.vsep([
    Doc.vsep(
      Record.toEntries(_names).map(([k, v]) =>
        Doc.text(`import ${v} from './${k}'`)
      )
    ),
    Doc.line,
    Doc.text(`export const mapData = {`),
    Doc.indent(
      Doc.vsep(Record.toEntries(_names).map(([k, _v]) => Doc.text(`${k},`))),
      2
    ),
    Doc.text(`}`),
  ])
}

export const convName = (
  _type: _Type
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const jsonStr = yield* fs.readFileString(`./${_type}.json`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jsonObj = JSON.parse(jsonStr)
    const geojson = decodeGeoJSON(jsonObj)
    const doc = printGeoJsonAsTs(_type, _types[_type], geojson)
    const ts = Doc.render(doc, { style: 'pretty' })
    yield* fs.writeFileString(`./${_type}.ts`, ts)
  })

// eslint-disable-next-line functional/functional-parameters
export const convNames = (): Effect.Effect<
  void[],
  PlatformError,
  FileSystem.FileSystem
> => Effect.all(Record.keys(_types).map(convName))

// eslint-disable-next-line functional/functional-parameters
export const saveAllTs = (): Effect.Effect<
  void,
  PlatformError,
  FileSystem.FileSystem
> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const doc = printAllTs()
    const ts = Doc.render(doc, { style: 'pretty' })
    yield* fs.writeFileString(`./all.ts`, ts)
  })

////

const _types = {
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

type _Type = keyof typeof _types

const _names = {
  areas: 'areas',
  internals: 'internals',
  origin: 'origin',
  measures: 'measures',
  viewbox: 'viewbox',

  'map-points': 'points',
  'map-lines': 'lines',
  'map-multilinestrings': 'multilinestrings',
  'map-multipolygons': 'multipolygons',
}
