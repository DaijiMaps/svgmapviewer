import { expect, test } from '@rstest/core'
import * as fs from 'node:fs'

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
  '../example-osm/src/data/areas_extent.json',
  '../example-osm/src/data/areas.json',
  '../example-osm/src/data/internals_extent.json',
  '../example-osm/src/data/internals.json',
  '../example-osm/src/data/map-lines.json',
  '../example-osm/src/data/map-multilinestrings.json',
  '../example-osm/src/data/map-multipolygons.json',
  '../example-osm/src/data/map-other_relations.json',
  '../example-osm/src/data/map-points.json',
  '../example-osm/src/data/measures.json',
  '../example-osm/src/data/origin.json',
  '../example-osm/src/data/viewbox.json',
] as const
