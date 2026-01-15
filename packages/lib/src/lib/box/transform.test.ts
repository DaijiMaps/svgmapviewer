import { expect, test } from '@rstest/core'
import { box } from './main'
import { toToransform } from './transform'
import { matrixObject, toMatrixObject } from '../matrix/dommatrixreadonly'

test('toTransform', () => {
  const a = box(0, 0, 1, 1)
  const b = box(1, 1, 1, 1)
  const c = box(0, 0, 2, 2)
  const d = box(1, 1, 2, 2)

  const t0 = toMatrixObject(toToransform(a, a))
  const m0 = matrixObject(1, 0, 0, 1, 0, 0)
  expect(t0).toEqual(m0)

  const t1 = toMatrixObject(toToransform(a, b))
  const m1 = matrixObject(1, 0, 0, 1, 1, 1)
  expect(t1).toEqual(m1)

  const t2 = toMatrixObject(toToransform(a, c))
  const m2 = matrixObject(2, 0, 0, 2, 0, 0)
  expect(t2).toEqual(m2)

  const t3 = toMatrixObject(toToransform(a, d))
  const m3 = matrixObject(2, 0, 0, 2, 1, 1)
  expect(t3).toEqual(m3)
})
