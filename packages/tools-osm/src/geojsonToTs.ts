/* eslint-disable functional/no-expression-statements */
import { FileSystem } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Doc } from '@effect/printer'
import { Effect, Record } from 'effect'
import { decodeGeoJSON } from './lib/geojson'
import { printAllTs, printGeoJsonAsTs } from './lib/print'

// XXX - split other_tags
// XXX - write all.ts

const NodeContextLive = NodeContext.layer

const convName = (_type: _Type) =>
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
const saveAllTs = () =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const doc = printAllTs()
    const ts = Doc.render(doc, { style: 'pretty' })
    yield* fs.writeFileString(`./all.ts`, ts)
  })

const program = Effect.gen(function* () {
  yield* Effect.all(Record.keys(_types).map(convName)).pipe(
    Effect.zip(saveAllTs())
  )
}).pipe(Effect.provide(NodeContextLive))

NodeRuntime.runMain(program)

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

/*
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

type _Name = keyof typeof _names
*/
