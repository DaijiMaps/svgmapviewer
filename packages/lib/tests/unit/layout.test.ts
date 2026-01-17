import { pipe } from 'fp-ts/lib/function'
import { expect, test } from '@rstest/core'
import {
  animationDone,
  //animationMove,
  animationZoom,
} from '../../src/lib/viewer/layout/animation'
import {
  boxBox as box,
  boxMove,
  boxUnit,
  type BoxBox as Box,
  boxCenter,
  boxScaleAt,
} from '../../src/lib/box/prefixed'
import { fromMatrixSvg } from '../../src/lib/viewer/layout/coord'
import {
  configLayout,
  emptyLayout,
  expandLayout1,
  //expandLayout,
  expandLayoutCenter,
  makeLayout,
  moveLayout,
  recenterLayout,
  relocLayout,
  rotateLayout,
  //recenterLayout,
  //relocLayout,
} from '../../src/lib/viewer/layout/layout'
import {
  vecVec as vec,
  vecScale,
  type VecVec as Vec,
} from '../../src/lib/vec/prefixed'
import {
  _box,
  _fixupLayout,
  _obj,
  fixupLayout,
  obj,
  toObj,
} from '../../src/lib/viewer/layout/layout-fixtures'

const container: Box = box(0, 0, 1200, 1000)
const origViewBox: Box = box(0, 0, 100, 100)

const config = configLayout(16, container, origViewBox)
const layout = makeLayout(config)
const cursor = boxCenter(container)

test('layout config', () => {
  // svg scaled to (1000, 1000)
  // margin x/y is 100/0
  expect(config.outer.x).closeTo(100, 1)
  expect(config.outer.y).closeTo(0, 1)
})

test('make layout', () => {
  expect(layout.config).toEqual(config)
  expect(layout.svgScale).toBe(0.1)
})

test('zoom layout', () => {
  const l0 = pipe(
    layout,
    (l) => animationZoom(l, 0, cursor),
    (a) => animationDone(layout, a)
  )
  const l1 = pipe(
    layout,
    (l) => animationZoom(l, 1, cursor),
    (a) => animationDone(layout, a)
  )

  expect(layout.svgScale).toBe(0.1)
  expect(l0.svgScale).toBe(layout.svgScale)
  expect(l1.svgScale / layout.svgScale).toBeCloseTo(1 / 3)
  //expect(l1.zoom).toBe(1)
})

test('expand center', () => {
  const l1 = expandLayoutCenter(expandLayout1(layout), 1)

  expect(fixupLayout(l1)).toEqual(
    _fixupLayout({
      ...layout,
      scroll: box(0, -100, 1200, 1200),
      svg: box(0, -10, 100, 120),
    })
  )
})

test('expand 2', () => {
  const l1 = pipe(layout, (l) => expandLayoutCenter(expandLayout1(l), 2))
  const l2 = pipe(l1, (l) => expandLayoutCenter(l, 1 / 2))

  expect(l1.scroll).toEqual(_box(box(-600, -700, 2400, 2400)))
  expect(l1.svg).toEqual(_box(box(-50, -70, 200, 240)))
  expect(l2.scroll).toEqual(_box(box(0, -100, 1200, 1200)))
  expect(l2.svg).toEqual(_box(box(0, -10, 100, 120)))
  expect(fixupLayout(l2)).toEqual(
    _fixupLayout({
      ...layout,
      scroll: box(0, -100, 1200, 1200),
      svg: box(0, -10, 100, 120),
    })
  )
})

const U = (() => {
  const container: Box = box(0, 0, 1, 1)
  const origViewBox: Box = box(0, 0, 1, 1)
  const config = configLayout(16, container, origViewBox)
  const layout = expandLayout1(makeLayout(config))
  const cursor = boxCenter(container)
  return {
    container,
    origViewBox,
    config,
    layout,
    cursor,
  }
})()

test('expand + zoom', () => {
  const l1 = expandLayoutCenter(U.layout, 3)
  const a1 = animationZoom(l1, 1, U.cursor)
  const l2 = animationDone(l1, a1)
  const a2 = animationZoom(l2, -1, U.cursor)
  const l3 = animationDone(l2, a2)
  const l4 = expandLayoutCenter(l3, 1 / 3)

  expect(fixupLayout(l4)).toEqual(
    _fixupLayout({
      ...U.layout,
    })
  )
})

test('expand + zoom 2', () => {
  const cursor = vec(0.25, 0.25)
  const l1 = expandLayoutCenter(U.layout, 3)
  const a1 = animationZoom(l1, 1, cursor)
  const l2 = animationDone(l1, a1)
  const a2 = animationZoom(l2, -1, cursor)
  const l3 = animationDone(l2, a2)
  const l4 = expandLayoutCenter(l3, 1 / 3)

  expect(fixupLayout(l4)).toEqual(
    _fixupLayout({
      ...U.layout,
    })
  )
})

test('boxScale', () => {
  const s = 2
  const o = vec(
    layout.config.container.width / 2,
    layout.config.container.height / 2
  )
  const opsvg = fromMatrixSvg(layout).inverse().transformPoint(o)
  const o2 = fromMatrixSvg(layout).transformPoint(opsvg)
  const scroll = boxScaleAt(layout.scroll, s, o.x, o.y)
  const svgOffset = vecScale(layout.svgOffset, s)
  const svg = boxScaleAt(layout.svg, s, opsvg.x, opsvg.y)

  expect(o.x).toBe(600)
  expect(o2.x).closeTo(o.x, 5)
  expect(layout.scroll.x).toBe(0)
  expect(layout.svgOffset.x).toBe(-100)
  expect(scroll.x).toBe(-600)
  expect(svgOffset.x).toBe(-200)
  expect(svg.x).closeTo(-50, 5)

  const coord = {
    ...layout,
    scroll,
    svgOffset,
    svg,
  }
  //const coordMatrixOuter = toMatrixOuter(coord);
  const coordMatrixSvg = fromMatrixSvg(coord).inverse()
  const p = vec(600, 500)
  const start = coordMatrixSvg.transformPoint(p)

  expect(toObj(coordMatrixSvg)).toEqual(_obj(obj(0.1, 0, 0, 0.1, -10, 0)))
  expect(start.x).toBeCloseTo(50)
  expect(start.y).toBeCloseTo(50)
})

test('reloc', () => {
  const o = vec(0, 0)
  const d = vec(1, 1)
  const l1 = relocLayout(emptyLayout, d)
  const l2 = relocLayout(l1, o)

  expect(l1.scroll).toEqual(box(1, 1, 1, 1))
  expect(l2.scroll).toEqual(boxUnit)
})

test('move', () => {
  const p = vec(1, 1)
  const q = vec(-1, -1)
  const l1 = moveLayout(emptyLayout, p)
  const l2 = moveLayout(l1, q)

  expect(l1.scroll).toEqual(box(1, 1, 1, 1))
  expect(l2.scroll).toEqual(boxUnit)
})

test('rotate', () => {
  const u = vec(1, 0)
  const l0 = emptyLayout
  const l1 = rotateLayout(l0, 90)
  const m1 = fromMatrixSvg(l1)
  const p1 = m1.transformPoint(u)
  const l2 = rotateLayout(l1, -90)
  const m2 = fromMatrixSvg(l2)
  const p2 = m2.transformPoint(u)

  expect(p1.x).toBe(1)
  expect(p1.y).toBe(1)
  expect(p2.x).toBe(1)
  expect(p2.y).toBe(0)
})

test('recenter 1', () => {
  const d1 = vec(0, 0)
  const l1 = recenterLayout(layout, d1)

  expect(l1).toEqual(layout)
})

test('recenter 2', () => {
  const start: Vec = layout.scroll
  const move = vec(100, 100)
  const l1 = moveLayout(layout, move)
  const l2 = recenterLayout(l1, start)
  const svg1 = layout.svg
  const svg2 = boxMove(svg1, vec(-10, -10))

  expect(l2.scroll).toEqual(layout.scroll)
  expect(l2.svg).toEqual(svg2)
})
