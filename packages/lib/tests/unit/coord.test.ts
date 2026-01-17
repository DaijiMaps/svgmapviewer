import { expect, test } from '@rstest/core'
import {
  emptyLayoutConfig,
  emptyLayoutCoord,
  fromMatrixSvg,
  makeCoord,
} from '../../src/lib/viewer/layout/coord'
import { boxBox, boxUnit } from '../../src/lib/box/prefixed'
import { vecVec } from '../../src/lib/vec/prefixed'
import {
  type LayoutConfig,
  makeLayout,
} from '../../src/lib/viewer/layout/layout'
import { matrixObject } from '../../src/lib/matrix/object'
import {
  dommatrixreadonlyToObject as matrixToObject,
  dommatrixreadonly as matrix,
} from '../../src/lib/matrix/dommatrixreadonly'

test('empty', () => {
  const c = emptyLayoutCoord
  expect(c.container).toEqual(boxUnit)
  expect(c.scroll).toEqual(boxUnit)
  expect(c.content).toEqual(matrix())
  expect(c.svgOffset).toEqual(vecVec(-0, -0))
  expect(c.svgScale).toEqual(1)
  expect(c.svg).toEqual(boxUnit)
})

test('make 0', () => {
  const c = makeCoord(emptyLayoutConfig)
  expect(c).toEqual(emptyLayoutCoord)
})

test('make 1', () => {
  const c = makeCoord({
    ...emptyLayoutConfig,
    container: boxBox(1, 2, 3, 4),
    outer: boxBox(5, 6, 0, 0),
    svgScale: 7,
    inner: boxBox(8, 9, 10, 11),
  })
  expect(c.container).toEqual(boxBox(1, 2, 3, 4))
  expect(c.scroll).toEqual(boxBox(1, 2, 3, 4))
  expect(c.content).toEqual(matrix())
  expect(c.svgOffset).toEqual(vecVec(-5, -6))
  expect(c.svgScale).toEqual(7)
  expect(c.svg).toEqual(boxBox(8, 9, 10, 11))
})

test('matrix 0', () => {
  const c: LayoutConfig = { ...emptyLayoutConfig, fontSize: 16 }
  const l = makeLayout(c)
  const m = fromMatrixSvg(l)
  const o = matrixToObject(m)
  expect(o).toEqual(matrixObject(1, 0, 0, 1, 0, 0))
})

test('matrix 1', () => {
  const d: LayoutConfig = {
    ...emptyLayoutConfig,
    container: boxBox(0, 0, 1, 1),
    outer: boxBox(0, 0, 0, 0),
    svgScale: 1,
    inner: boxBox(1, 1, 1, 1),
  }
  const c: LayoutConfig = { ...d, fontSize: 16 }
  const l = makeLayout(c)
  const m = fromMatrixSvg(l)
  const o = matrixToObject(m)
  expect(o).toEqual(matrixObject(1, 0, 0, 1, -1, -1))
})

test('matrix 2', () => {
  const d: LayoutConfig = {
    ...emptyLayoutConfig,
    container: boxBox(0, 0, 1, 1),
    outer: boxBox(0, 0, 0, 0),
    svgScale: 2,
    inner: boxBox(0, 0, 2, 2),
  }
  const c: LayoutConfig = { ...d, fontSize: 16 }
  const l = makeLayout(c)
  const m = fromMatrixSvg(l)
  const o = matrixToObject(m)
  expect(o).toEqual(matrixObject(0.5, 0, 0, 0.5, 0, 0))
})
