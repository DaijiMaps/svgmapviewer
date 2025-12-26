import * as fs from 'node:fs'
import { Doc } from '@effect/printer'
import { expect, test } from '@rstest/core'
import { printGeoJSON, printProperties, truncNumber } from './geojson-print'
import { _Properties } from './geojson-types'

test('printProperties', () => {
  const p: _Properties = { a: 123, b: 'xyz', c: null }
  const s = Doc.render(printProperties(p), { style: 'pretty' })

  expect(s).toEqual(`properties: {
  a: 123,
  b: "xyz",
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
    } catch (e) {
      console.error(e)
    }
  })
})

test('truncNumber', () => {
  const n = truncNumber(1.1111111111)
  expect(`${n}`).toBe(`1.111111`)
  const i = truncNumber(123)
  expect(`${i}`).toBe(`123`)
})

const exampleGeoJsonFiles = ['../example-osm/src/data/areas_extent.json']
