import { expect, test } from '@rstest/core'
import { splitTypes } from './print-utils'

test('split types', () => {
  const s = 'a<b<c, d>, e<f, g>, h>'

  const t = splitTypes(s)
  const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  expect(t).toEqual(x)
})
