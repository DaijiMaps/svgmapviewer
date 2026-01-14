import { expect, test } from '@rstest/core'
import { emptyLayoutCoord, makeCoord } from '../../src/lib/viewer/layout/coord'
import {} from '../../src/lib/viewer/layout/transform'
import { boxBox, boxUnit } from '../../src/lib/box/prefixed'
import { vecVec } from '../../src/lib/vec/prefixed'

test('empty', () => {
  const c = emptyLayoutCoord
  expect(c.container).toEqual(boxUnit)
  expect(c.scroll).toEqual(boxUnit)
  expect(c.content).toEqual(new DOMMatrixReadOnly())
  expect(c.svgOffset).toEqual(vecVec(0, 0))
  expect(c.svgScale).toEqual({ s: 1 })
  expect(c.svg).toEqual(boxUnit)
})

test('make', () => {
  const c = makeCoord({
    container: boxBox(1, 2, 3, 4),
    svgOffset: vecVec(5, 6),
    svgScale: { s: 7 },
    svg: boxBox(8, 9, 10, 11),
  })
  expect(c.container).toEqual(boxBox(1, 2, 3, 4))
  expect(c.scroll).toEqual(boxBox(1, 2, 3, 4))
  expect(c.content).toEqual(new DOMMatrixReadOnly())
  expect(c.svgOffset).toEqual(vecVec(5, 6))
  expect(c.svgScale).toEqual({ s: 7 })
  expect(c.svg).toEqual(boxBox(8, 9, 10, 11))
})
