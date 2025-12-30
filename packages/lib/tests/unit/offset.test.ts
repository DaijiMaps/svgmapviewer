import { expect, test } from '@rstest/core'
import { voffset } from '../../src/lib/text'
import { trunc2 } from '../../src/lib/utils'

test('offset', () => {
  const o1 = trunc2(voffset(1, 0))

  const o3 = [0, 1, 2].map((i) => trunc2(voffset(3, i)))

  expect(o1).toBe(o3[1])
})
