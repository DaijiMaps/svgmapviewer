import * as fs from 'node:fs'

import { expect, test } from '@rstest/core'

import { decodeGeoJSON, decodeProperties } from './geojson-schema'

test('decodeProperties', () => {
  const o = {
    a: 1,
    b: 'b',
    c: null,
  }
  const x = decodeProperties(o)
  expect(x).toEqual(o)
})

test('decodeGeoJSON', () => {
  exampleGeoJsonFiles.forEach((p) => {
    try {
      const content = fs.readFileSync(p)
      const o = JSON.parse(content.toString())
      const x = decodeGeoJSON(o)
      expect(x).toEqual(o)
    } catch (e) {
      console.error(p, e)
    }
  })
})

const exampleGeoJsonFiles = [
  '../examples/example-osm/src/data/areas_extent.json',
  '../examples/example-osm/src/data/areas.json',
  '../examples/example-osm/src/data/internals_extent.json',
  '../examples/example-osm/src/data/internals.json',
  '../examples/example-osm/src/data/map-lines.json',
  '../examples/example-osm/src/data/map-multilinestrings.json',
  '../examples/example-osm/src/data/map-multipolygons.json',
  '../examples/example-osm/src/data/map-other_relations.json',
  '../examples/example-osm/src/data/map-points.json',
  '../examples/example-osm/src/data/measures.json',
  '../examples/example-osm/src/data/origin.json',
  '../examples/example-osm/src/data/viewbox.json',
] as const
