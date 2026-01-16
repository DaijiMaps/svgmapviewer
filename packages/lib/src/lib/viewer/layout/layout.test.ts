import { expect, test } from '@rstest/core'
import { configLayout, type LayoutConfig } from './layout'
import { boxBox } from '../../box/prefixed'

test('config', () => {
  const svg = boxBox(0, 0, 1, 1)
  const container = boxBox(0, 0, 1, 1)
  const res: LayoutConfig = configLayout(16, container, svg)
  const exp: LayoutConfig = {
    fontSize: 16,
    container,
    svgOffset: { x: _(0), y: _(0) },
    svgScale: { s: 1 },
    svg,
  }
  expect(res).toEqual(exp)
})

////
//
const _ = (v: number) => expect.closeTo(v, 0)
