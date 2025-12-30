import { expect, test } from '@rstest/core'
import { trunc2 } from '../../src/lib/utils'

const sizes = [2, 3, 4, 5, 6, 8]

function getOpacities(
  sizes: readonly number[],
  scale: number
): readonly { size: number; opacity: number }[] {
  return sizes
    .map((sz) => sz * sz)
    .map((sz) => {
      const ss = sz / scale
      const MAX = 100
      const MIN = 0
      const opacity = trunc2(
        Math.pow(ss > MAX ? 0 : ss < MIN ? 1 : (MAX - ss) / (MAX - MIN), 2)
      )
      return { size: sz, opacity }
    })
}

test('opacity', () => {
  const o = getOpacities(sizes, 1).map((o) => o.opacity)
  expect(o[0]).toBeLessThan(1)
  expect(o.slice(-1)[0]).toBeGreaterThan(0)
  const o2 = o.sort((a, b) => (a < b ? 1 : -1))
  expect(o).toEqual(o2)
})
