import { Doc } from '@effect/printer'
import { expect, test } from '@rstest/core'

test('printProperties', () => {
  const s = Doc.render(Doc.text('a'), { style: 'pretty' })

  expect(s).toBe('a')
})
