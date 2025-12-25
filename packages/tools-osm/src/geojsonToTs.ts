/* eslint-disable functional/no-expression-statements */
import { FileSystem } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect } from 'effect'
import { decodeGeoJSON } from './lib/geojson'

// XXX - effect Schema
// XXX - split other_tags

const NodeContextLive = NodeContext.layer

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const jsonStr = yield* fs.readFileString('./test/geojson.json')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const jsonObj = JSON.parse(jsonStr)
  const geojson = decodeGeoJSON(jsonObj)
  console.log(geojson)
  return geojson
}).pipe(Effect.provide(NodeContextLive))

NodeRuntime.runMain(program)

// areas.json
// internals.json
// origin.json
// measures.json
// viewbox.json
// map-points.json
// map-lines.json
// map-multilinestrings.json
// map-multipolygons.json
