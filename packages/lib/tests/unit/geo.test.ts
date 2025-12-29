import { expect, test } from '@rstest/core'
import { haversineDistance } from '../../src/lib/geo/distance'

const oslo = {
  x: 10.752,
  y: 59.914,
}

const berlin = {
  x: 13.412,
  y: 52.523,
}

test('distance', () => {
  const d = haversineDistance(oslo, berlin)
  console.log(d)
  // about 800km
  expect(d > 800000).toBe(true)
  expect(d < 900000).toBe(true)
})
