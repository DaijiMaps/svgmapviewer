import { expect, test } from '@rstest/core'
import { boxBox as box, type BoxBox as Box } from '../../src/lib/box/prefixed'
import { fit } from '../../src/lib/viewer/layout/fit'

type FitTest = Readonly<{
  name: string
  O: Box
  I: Box
  o: Box
  i: Box
  s: number
}>

const fitTests: FitTest[] = [
  {
    name: 'fit vertical',
    O: box(0, 0, 200, 100),
    I: box(0, 0, 10, 40),
    o: box(87.5, 0, 25, 100),
    i: box(-35, 0, 80, 40),
    s: 40 / 100,
  },
  {
    name: 'fit horizontal',
    O: box(0, 0, 100, 200),
    I: box(0, 0, 40, 10),
    o: box(0, 87.5, 100, 25),
    i: box(0, -35, 40, 80),
    s: 40 / 100,
  },
]

fitTests.forEach(({ name, O, I, o, i, s }) => {
  test(name, () => {
    const { outer, inner, scale } = fit(O, I)
    expect(outer).toEqual(o)
    expect(inner).toEqual(i)
    expect(scale).toBe(s)
  })
})
