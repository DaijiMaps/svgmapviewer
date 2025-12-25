/* eslint-disable functional/no-expression-statements */
import { FileSystem } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Doc } from '@effect/printer'
import { Effect } from 'effect'
import { decodeGeoJSON } from './lib/geojson'
import { printGeoJsonAsTs } from './lib/print'

// XXX - effect Schema
// XXX - split other_tags

const NodeContextLive = NodeContext.layer

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const jsonStr = yield* fs.readFileString('./areas.json')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const jsonObj = JSON.parse(jsonStr)
  const geojson = decodeGeoJSON(jsonObj)
  const doc = printGeoJsonAsTs('areas', 'MultiPolygonGeoJSON', geojson)
  console.log(Doc.render(doc, { style: 'pretty' }))
  return geojson
}).pipe(Effect.provide(NodeContextLive))

NodeRuntime.runMain(program)

/*
const names = {
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
*/
