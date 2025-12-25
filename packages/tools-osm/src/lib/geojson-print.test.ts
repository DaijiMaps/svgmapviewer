import * as fs from 'node:fs'
import { Doc } from '@effect/printer'
import { expect, test } from '@rstest/core'
import { printGeoJSON, printProperties } from './geojson-print'
import { _Properties } from './geojson-types'

test('printProperties', () => {
  const p: _Properties = { a: 123, b: 'xyz', c: null }
  const s = Doc.render(printProperties(p), { style: 'pretty' })

  console.log(s)
  expect(s).toEqual(`properties: {
  a: 123,
  b: 'xyz',
  c: null,
},`)
})

test('printGeoJSON', () => {
  exampleGeoJsonFiles.forEach((p) => {
    try {
      const b = fs.readFileSync(p)
      const o = JSON.parse(b.toString())
      const doc = printGeoJSON(o)
      const s = Doc.render(doc, { style: 'pretty' })
      console.log(s)
    } catch (e) {
      console.error(e)
    }
  })
})

const exampleGeoJsonFiles = ['../example-osm/src/data/areas_extent.json']
