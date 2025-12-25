import { expect, test } from '@rstest/core'
import areas from '../../test/geojson.json'
import { decodeGeoJSON, decodeProperties } from './geojson'

const crsName = areas.crs.properties.name

test('decodeProperties', () => {
  const v = {
    a: 1,
    b: 'b',
    c: null,
  }
  const o = decodeProperties(v)
  console.log(o)
})

test('decodeGeoJSON', () => {
  const o = decodeGeoJSON(areas)
  expect(o?.crs?.properties?.name ?? '').toBe(crsName)
})
