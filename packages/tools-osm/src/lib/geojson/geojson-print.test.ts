import * as fs from 'node:fs'
import { Doc } from '@effect/printer'
import { expect, test } from '@rstest/core'
import {
  isTuple,
  printGeoJSON,
  printProperties,
  truncNumber,
} from './geojson-print'
import { _Coordinates, _Properties } from './geojson-types'

test('printProperties', () => {
  const p: _Properties = { a: 123, b: 'xyz', c: null }
  const s = Doc.render(printProperties(p), { style: 'pretty' })

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
      const ma = s.match(/^{/)
      const mb = s.match(/}$/)
      expect(ma !== null).toBe(true)
      expect(mb !== null).toBe(true)
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

test('isTuple', () => {
  const os: readonly _Coordinates[] = [[1, 2]]
  const xs: readonly _Coordinates[] = [
    [
      [1, 2],
      [3, 4],
    ],
  ]
  os.forEach((o) => expect(isTuple(o)).toBe(true))
  xs.forEach((o) => expect(isTuple(o)).toBe(false))
})

const exampleGeoJsonFiles = ['../example-osm/src/data/areas_extent.json']
