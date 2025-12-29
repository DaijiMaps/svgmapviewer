import { expect, test } from '@rstest/core'
import { diag } from '../../src/lib/ui/diag'
import { type Size } from '../../src/types'
import { type Vec } from '../../src/lib/vec'

test('diag', () => {
  const s: Size = { width: 4, height: 3 }

  const vecs: Vec[] = [
    { x: 2, y: 0 },
    { x: 4, y: 1.5 },
    { x: 2, y: 3 },
    { x: 0, y: 1.5 },

    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 0, y: 3 },
    { x: 0, y: 0 },
  ]

  const exps = [
    { h: 0, v: 1 },
    { h: -1, v: 0 },
    { h: 0, v: -1 },
    { h: 1, v: 0 },

    { h: -1, v: 1 },
    { h: -1, v: -1 },
    { h: 1, v: -1 },
    { h: 1, v: 1 },
  ]

  exps.forEach((x, idx) => {
    const vec = vecs[idx]
    const { h, v } = diag(s, vec)
    expect({ h, v }).toEqual(x)
  })
})
