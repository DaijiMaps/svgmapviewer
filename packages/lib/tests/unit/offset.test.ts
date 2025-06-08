import { expect, test } from 'vitest'
import { voffset } from '../../src/lib/text'
import { trunc2 } from '../../src/lib/utils'

test('offset', () => {
  const o1 = trunc2(voffset(1, 0))
  console.log(o1)

  const o3 = [0, 1, 2].map((i) => trunc2(voffset(3, i)))
  console.log(o3)

  expect(o1).toBe(o3[1])
})
