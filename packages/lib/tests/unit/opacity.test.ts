import { test } from 'vitest'
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
  console.log(sizes)
  const opacities = getOpacities(sizes, 1)
  console.log(opacities)
})
