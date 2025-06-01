import { expect, test } from 'vitest'
import { findDiv, findRadius } from '../../src/lib/distance'
import { emptyLayout, Layout } from '../../src/lib/layout'

const layout: Layout = {
  ...emptyLayout,
  container: {
    ...emptyLayout.container,
    width: 300,
    height: 500,
  },
  svgScale: {
    s: 0.1,
  },
}

test('findDiv', () => {
  for (let i = 10; i < 100; i++) {
    const ns = findDiv(i)
    if (ns.length > 5) {
      //console.log(i, ns)
    }
    if (ns.length < 3) {
      //console.log(i, ns)
    }
  }
})

test('distance', () => {
  const r = findRadius(layout)
  //console.log(r)
  expect(r.client).toBe(50)
})
