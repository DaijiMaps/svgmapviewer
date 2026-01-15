import { expect, test } from '@rstest/core'
import {
  emptyLayoutCoord,
  fromMatrixSvg,
  type LayoutCoord,
  makeCoord,
} from '../../src/lib/viewer/layout/coord'
import {} from '../../src/lib/viewer/layout/transform'
import { boxBox, boxUnit } from '../../src/lib/box/prefixed'
import { vecVec } from '../../src/lib/vec/prefixed'
import {
  type LayoutConfig,
  makeLayout,
} from '../../src/lib/viewer/layout/layout'
import {
  matrixObject,
  toMatrixObject,
} from '../../src/lib/matrix/dommatrixreadonly'

test('empty', () => {
  const c = emptyLayoutCoord
  expect(c.container).toEqual(boxUnit)
  expect(c.scroll).toEqual(boxUnit)
  expect(c.content).toEqual(new DOMMatrixReadOnly())
  expect(c.svgOffset).toEqual(vecVec(0, 0))
  expect(c.svgScale).toEqual({ s: 1 })
  expect(c.svg).toEqual(boxUnit)
})

test('make 0', () => {
  const c = makeCoord({
    container: boxBox(0, 0, 1, 1),
    svgOffset: vecVec(0, 0),
    svgScale: { s: 1 },
    svg: boxBox(0, 0, 1, 1),
  })
  expect(c).toEqual(emptyLayoutCoord)
})

test('make 1', () => {
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

test('matrix 0', () => {
  const c: LayoutConfig = { ...emptyLayoutCoord, fontSize: 16 }
  const l = makeLayout(c)
  const m = fromMatrixSvg(l)
  const o = toMatrixObject(m)
  expect(o).toEqual(matrixObject(1, 0, 0, 1, 0, 0))
})

test('matrix 1', () => {
  const d: LayoutCoord = makeCoord({
    container: boxBox(0, 0, 1, 1),
    svgOffset: vecVec(0, 0),
    svgScale: { s: 1 },
    svg: boxBox(1, 1, 1, 1),
  })
  const c: LayoutConfig = { ...d, fontSize: 16 }
  const l = makeLayout(c)
  const m = fromMatrixSvg(l)
  const o = toMatrixObject(m)
  expect(o).toEqual(matrixObject(1, 0, 0, 1, -1, -1))
})

test('matrix 2', () => {
  const d: LayoutCoord = makeCoord({
    container: boxBox(0, 0, 1, 1),
    svgOffset: vecVec(0, 0),
    svgScale: { s: 2 },
    svg: boxBox(0, 0, 2, 2),
  })
  const c: LayoutConfig = { ...d, fontSize: 16 }
  const l = makeLayout(c)
  const m = fromMatrixSvg(l)
  const o = toMatrixObject(m)
  expect(o).toEqual(matrixObject(0.5, 0, 0, 0.5, 0, 0))
})
