import { pipe } from 'fp-ts/function'
import { expect, test } from '@rstest/core'
import { divF } from './div'
import { vec } from './index'

test('divF', () => {
  const f = divF(vec(2, 2))
  const res = pipe(vec(1, 1), f)

  expect(res.x).toBeCloseTo(0.5)
})
