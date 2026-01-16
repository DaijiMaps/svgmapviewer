import { pipe } from 'fp-ts/lib/function'
import { expect, test } from '@rstest/core'
import {
  animationDone,
  //animationMove,
  animationZoom,
} from '../../src/lib/viewer/layout/animation'
import {
  boxBox,
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
  //expandLayout,
  expandLayoutCenter,
  type Layout,
  makeLayout,
  moveLayout,
  recenterLayout,
  relocLayout,
  rotateLayout,
  //recenterLayout,
  //relocLayout,
} from '../../src/lib/viewer/layout/layout'
import { transformScale } from '../../src/lib/viewer/layout/transform'
import { vecVec, type VecVec } from '../../src/lib/vec/prefixed'
import {
  type MatrixObject,
  dommatrixreadonlyTranslateOnly,
} from '../../src/lib/matrix/dommatrixreadonly'

const container: Box = { x: 0, y: 0, width: 1200, height: 1000 }
const origViewBox: Box = { x: 0, y: 0, width: 100, height: 100 }

const config = configLayout(16, container, origViewBox)
const layout = makeLayout(config)
const cursor = boxCenter(container)

test('layout config', () => {
  // svg scaled to (1000, 1000)
  // margin x/y is 100/0
  expect(config.svgOffset.x).closeTo(-100, 1)
  expect(config.svgOffset.y).closeTo(-0, 1)
})

test('make layout', () => {
  expect(layout.config).toStrictEqual(config)
  expect(layout.svgScale.s).toBe(0.1)
})

test('zoom layout', () => {
  expect(layout.svgScale.s).toBe(0.1)
  const l0 = pipe(
    layout,
    (l) => animationZoom(l, 0, cursor),
    (a) => animationDone(layout, a)
  )
  expect(l0.svgScale.s).toBe(layout.svgScale.s)
  const l1 = pipe(
    layout,
    (l) => animationZoom(l, 1, cursor),
    (a) => animationDone(layout, a)
  )
  expect(l1.svgScale.s / layout.svgScale.s).toBeCloseTo(1 / 3)
  //expect(l1.zoom).toBe(1)
})

test('expand center', () => {
  const l1 = expandLayoutCenter(layout, 1)
  expect(fixupLayout(l1)).toStrictEqual(
    _layoutToString({
      ...layout,
      scroll: {
        ...layout.scroll,
        height: _(1200),
        y: _(-100),
      },
      scroll_: new DOMMatrixReadOnly([1, 0, 0, 1, 0, -100]),
      svg: {
        ...layout.svg,
        height: _(120),
        y: _(-10),
      },
      svg_: new DOMMatrixReadOnly([1, 0, 0, 1.2, 0, -10]),
    })
  )
})

test('expand 2', () => {
  const l1 = pipe(layout, (l) => expandLayoutCenter(l, 2))
  const l2 = pipe(l1, (l) => expandLayoutCenter(l, 1 / 2))

  expect(l1.scroll).toStrictEqual({
    x: -600,
    y: -700,
    width: 2400,
    height: 2400,
  })
  expect(l1.svg).toStrictEqual({
    x: _(-50),
    y: _(-70),
    width: 200,
    height: 240,
  })
  expect(l2.scroll).toStrictEqual({
    x: 0,
    y: -220,
    width: 1200,
    height: 1440,
  })
  expect(l2.svg).toStrictEqual({
    x: _(0),
    y: _(-22),
    width: 100,
    height: 144,
  })
  expect(fixupLayout(l2)).toStrictEqual(
    _layoutToString({
      ...layout,
      scroll: {
        ...layout.scroll,
        height: 1440,
        y: -220,
      },
      scroll_: new DOMMatrixReadOnly([1, 0, 0, 1, 0, -220]),
      svg: {
        ...layout.svg,
        height: _(144),
        x: _(0),
        y: _(-22),
      },
      svg_: new DOMMatrixReadOnly([1, 0, 0, 1.44, 0, -22]),
    })
  )
})

const U = (() => {
  const container: Box = { x: 0, y: 0, width: 1, height: 1 }
  const origViewBox: Box = { x: 0, y: 0, width: 1, height: 1 }
  const config = configLayout(16, container, origViewBox)
  const layout = makeLayout(config)
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
  expect(l1.svg_.e).toEqual(l1.svg.x)
  expect(l1.svg_.f).toEqual(l1.svg.y)
  const a1 = animationZoom(l1, 1, U.cursor)

  const l2 = animationDone(l1, a1)
  const a2 = animationZoom(l2, -1, U.cursor)

  const l3 = animationDone(l2, a2)

  const l4 = expandLayoutCenter(l3, 1 / 3)

  expect(l4.svg_.e).toEqual(l4.svg.x)
  expect(l4.svg_.f).toEqual(l4.svg.y)
  expect(fixupLayout(l4)).toEqual(
    _layoutToString({
      ...U.layout,
      scroll: {
        ...U.layout.scroll,
        x: expect.closeTo(U.layout.scroll.x),
        y: expect.closeTo(U.layout.scroll.y),
      },
      svg: {
        ...U.layout.svg,
        x: expect.closeTo(U.layout.svg.x),
        y: expect.closeTo(U.layout.svg.y),
      },
      svg_: new DOMMatrixReadOnly([1, 0, 0, 1, U.layout.svg.x, U.layout.svg.y]),
    })
  )
})

test('expand + zoom 2', () => {
  const cursor = vecVec(0.25, 0.25)

  const l1 = expandLayoutCenter(U.layout, 3)
  const a1 = animationZoom(l1, 1, cursor)
  const l2 = animationDone(l1, a1)
  const a2 = animationZoom(l2, -1, cursor)
  const l3 = animationDone(l2, a2)
  const l4 = expandLayoutCenter(l3, 1 / 3)

  expect(fixupLayout(l4)).toEqual(
    _layoutToString({
      ...U.layout,
      scroll: {
        ...U.layout.scroll,
        x: expect.closeTo(U.layout.scroll.x),
        y: expect.closeTo(U.layout.scroll.y),
      },
      svg: {
        ...U.layout.svg,
        x: expect.closeTo(U.layout.svg.x),
        y: expect.closeTo(U.layout.svg.y),
      },
      svg_: new DOMMatrixReadOnly([1, 0, 0, 1, U.layout.svg.x, U.layout.svg.y]),
    })
  )
})

test('expand + zoom 3', () => {
  const res = pipe(
    { l: layout, a: null, d: null },
    ({ l, a, d }) => ({
      l: expandLayoutCenter(l, 3),
      a,
      d,
    }),
    ({ l, d }) => ({
      l,
      a: animationZoom(l, 1, cursor),
      d,
    }),
    ({ l, a, d }) => ({
      l: animationDone(l, a),
      a,
      d,
    }),
    ({ l, d }) => ({
      l,
      a: animationZoom(l, -1, cursor),
      d,
    }),
    ({ l, a, d }) => ({
      l: animationDone(l, a),
      a,
      d,
    }),
    ({ l, a, d }) => ({
      l: expandLayoutCenter(l, 1 / 3),
      a,
      d,
    })
  )
  expect(fixupLayout(layout)).toStrictEqual(
    _layoutToString({
      ...res.l,
      scroll: {
        ...res.l.scroll,
        height: 1000,
        x: expect.closeTo(0, 5),
        y: expect.closeTo(0, 5),
      },
      scroll_: new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]),
      svg: {
        ...res.l.svg,
        width: _(100),
        height: _(100),
        x: _(0),
        y: _(0),
      },
      svg_: new DOMMatrixReadOnly(),
    })
  )
})

test('boxScale', () => {
  const s = 2

  const o = vecVec(
    layout.config.container.width / 2,
    layout.config.container.height / 2
  )

  expect(o.x).toBe(600)

  const opsvg = fromMatrixSvg(layout).inverse().transformPoint(o)

  const o2 = fromMatrixSvg(layout).transformPoint(opsvg)
  expect(o2.x).closeTo(o.x, 5)

  const scroll = boxScaleAt(layout.scroll, s, o.x, o.y)
  const scroll_ = dommatrixreadonlyTranslateOnly(
    new DOMMatrixReadOnly().translate(o.x, o.y).scale(s).translate(-o.x, -o.y)
  )
  const svgOffset = transformScale(layout.svgOffset, s)
  const svgOffset_ = new DOMMatrixReadOnly().translate(
    layout.svgOffset_.e * s,
    layout.svgOffset_.f * s
  )
  const svg = boxScaleAt(layout.svg, s, opsvg.x, opsvg.y)
  const svg_ = dommatrixreadonlyTranslateOnly(
    new DOMMatrixReadOnly()
      .translate(opsvg.x, opsvg.y)
      .scale(s)
      .translate(-opsvg.x, -opsvg.y)
  )

  expect(layout.scroll.x).toBe(0)
  expect(layout.svgOffset.x).toBe(-100)
  expect(scroll.x).toBe(-600)
  expect(svgOffset.x).toBe(-200)
  expect(svgOffset_.e).toBe(-200)
  expect(svg.x).closeTo(-50, 5)
  expect(svg_.e).closeTo(-50, 5)

  const coord = {
    ...layout,
    scroll,
    scroll_,
    svgOffset,
    svgOffset_,
    svg,
    svg_,
  }
  //const coordMatrixOuter = toMatrixOuter(coord);
  const coordMatrixSvg = fromMatrixSvg(coord).inverse()
  expect(mToObj(coordMatrixSvg)).toEqual({
    a: 0.1,
    b: 0,
    c: 0,
    d: 0.1,
    e: _(-10),
    f: _(0),
  })

  const p = vecVec(600, 500)
  const start = coordMatrixSvg.transformPoint(p)

  expect(start.x).toBeCloseTo(50)
  expect(start.y).toBeCloseTo(50)
})

test('reloc', () => {
  const o = vecVec(0, 0)
  const d = vecVec(1, 1)
  const l1 = relocLayout(emptyLayout, d)
  expect(l1.scroll).toEqual(boxBox(1, 1, 1, 1))
  const l2 = relocLayout(l1, o)
  expect(l2.scroll).toEqual(boxUnit)
})

test('move', () => {
  const p = vecVec(1, 1)
  const q = vecVec(-1, -1)
  const l1 = moveLayout(emptyLayout, p)
  expect(l1.scroll).toEqual(boxBox(1, 1, 1, 1))
  const l2 = moveLayout(l1, q)
  expect(l2.scroll).toEqual(boxUnit)
})

test('rotate', () => {
  const u = vecVec(1, 0)
  const l0 = emptyLayout

  const l1 = rotateLayout(l0, 90)
  const m1 = fromMatrixSvg(l1)
  const p1 = m1.transformPoint(u)
  expect(p1.x).toBe(1)
  expect(p1.y).toBe(1)

  const l2 = rotateLayout(l1, -90)
  const m2 = fromMatrixSvg(l2)
  const p2 = m2.transformPoint(u)
  expect(p2.x).toBe(1)
  expect(p2.y).toBe(0)
})

test('recenter 1', () => {
  const d1 = vecVec(0, 0)
  const l1 = recenterLayout(layout, d1)
  expect(l1).toEqual(layout)
})

test('recenter 2', () => {
  const start: VecVec = layout.scroll
  const move = vecVec(100, 100)
  const l1 = moveLayout(layout, move)
  const l2 = recenterLayout(l1, start)
  const svg1 = layout.svg
  const svg2 = boxMove(svg1, vecVec(-10, -10))
  expect(l2.scroll).toEqual(layout.scroll)
  expect(l2.svg).toEqual(svg2)
})

////

function fixupLayout(layout: Layout): Omit<
  Layout,
  'content' | 'scroll_' | 'svgOffset_' | 'svgScale_' | 'svg_'
> & {
  content: MatrixObject
  scroll_: MatrixObject
  svgOffset_: MatrixObject
  svgScale_: MatrixObject
  svg_: MatrixObject
} {
  return {
    ...layout,
    content: mToObj(layout.content),
    scroll_: mToObj(layout.scroll_),
    svgOffset_: mToObj(layout.svgOffset_),
    svgScale_: mToObj(layout.svgScale_),
    svg_: mToObj(layout.svg_),
  }
}

function _layoutToString(layout: Layout): Omit<
  Layout,
  'content' | 'scroll_' | 'svgOffset_' | 'svgScale_' | 'svg_'
> & {
  content: MatrixObject
  scroll_: MatrixObject
  svgOffset_: MatrixObject
  svgScale_: MatrixObject
  svg_: MatrixObject
} {
  return {
    ...layout,
    content: _mToObj(layout.content),
    scroll_: _mToObj(layout.scroll_),
    svgOffset_: _mToObj(layout.svgOffset_),
    svgScale_: _mToObj(layout.svgScale_),
    svg_: _mToObj(layout.svg_),
  }
}

function mToObj(m: DOMMatrixReadOnly): MatrixObject {
  return {
    a: m.a,
    b: m.b,
    c: m.c,
    d: m.d,
    e: m.e,
    f: m.f,
  }
}

function _mToObj(m: DOMMatrixReadOnly) {
  const { a, b, c, d, e, f } = mToObj(m)
  return {
    a: _(a),
    b: _(b),
    c: _(c),
    d: _(d),
    e: _(e),
    f: _(f),
  }
}

/*
test('recenter 3', () => {
  const l1 = expandLayout(layout, 2, cursor)
  const d1 = dragStart(l1.scroll, cursor)
  const d2 = dragMove(d1, vecVec(0, 0))
  const d3 = dragMove(d2, vecVec(600, 500))
  const l2 = relocLayout(l1, d3.move)
  const l3 = recenterLayout(l2, d3.start)
  const l4 = expandLayout(l3, 1 / 2, cursor)
  expect(l4).toStrictEqual({
    ...layout,
    scroll: {
      ...layout.scroll,
      height: 1440,
      y: -220,
    },
    svg: { ...layout.svg, height: _(144), y: _(-22) },
  })
})

test('recenter 4', () => {
  const cursor = vecVec(0, 0)
  const d1 = pipe(layout, (l) => dragStart(l.scroll, cursor))
  const ox1 = d1.start.x
  const x1 = layout.scroll.x
  expect(ox1).toBe(0)
  expect(x1).toBe(0)

  const d2 = dragMove(d1, vecVec(0, 0))
  const l2 = pipe(d2, (d) =>
    pipe(
      layout,
      (l) => relocLayout(l, d.move),
      (l) => recenterLayout(l, d.start)
    )
  )
  const ox2 = d2.start.x
  const x2 = d2.move.x
  expect(ox2).toBe(0)
  expect(x2).toBe(0)

  const d3 = dragMove(d2, vecVec(1, 1))
  const l3 = relocLayout(l2, d3.move)
  const ox3 = d3.start.x
  const x3 = d3.move.x
  expect(ox3).toBe(0)
  expect(x3).toBe(1)

  const l4 = recenterLayout(l3, d3.start)
  const d4 = dragReset(l4.scroll)
  const ox4 = d4.start.x
  const x4 = d4.move.x
  expect(ox4).toBe(0)
  expect(x4).toBe(0)
})

test('move + zoom', () => {
  const d1 = dragStart(layout.scroll, cursor)
  const d2 = dragMove(d1, vecVec(0, 0))
  const l2 = recenterLayout(layout, d2.start)
  const a1 = animationZoom(l2, 1, cursor)
  const l3 = animationDone(l2, a1)
  const a2 = animationZoom(l3, -1, cursor)
  const l4 = animationDone(l3, a2)
  const d5 = dragStart(l4.scroll, cursor)
  const a6 = animationMove(l4, d5, vecVec(-1, 0))
  const l5 = animationDone(l4, a6)
  const l6 = relocLayout(l5, d5.move)
  const l7 = recenterLayout(l6, d5.start)

  expect(layout).toStrictEqual({
    ...l7,
    svg: {
      ...l7.svg,
      x: expect.closeTo(0, 5),
      y: expect.closeTo(0, 5),
    },
  })
})
*/

// XXX
const _ = (v: number) => expect.closeTo(v, 0)
