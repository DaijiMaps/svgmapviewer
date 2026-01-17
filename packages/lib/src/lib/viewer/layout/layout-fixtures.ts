// oxlint-disable no-unused-vars
import { expect } from '@rstest/core'

import { type BoxBox as Box } from '../../box/prefixed'
import { type Layout } from './layout'
import { type MatrixObject } from '../../matrix/object'
import { dommatrixreadonlyToObject as toObj } from '../../matrix/dommatrixreadonly'

export function fixupLayout(layout: Layout): Omit<Layout, 'content'> & {
  content: MatrixObject
} {
  return {
    ...layout,
    content: toObj(layout.content),
  }
}

export function _fixupLayout(layout: Layout): Omit<
  Layout,
  'content' | 'scroll' | 'svg'
> & {
  content: MatrixObject
  scroll: Box
  svg: Box
} {
  return {
    ...layout,
    content: _obj(toObj(layout.content)),
    scroll: _box(layout.scroll),
    svg: _box(layout.svg),
  }
}

////

export type Obj<T> = { a: T; b: T; c: T; d: T; e: T; f: T }

export function obj<T>(a: T, b: T, c: T, d: T, e: T, f: T): Obj<T> {
  return { a, b, c, d, e, f }
}

export function _obj({ a, b, c, d, e, f }: MatrixObject) {
  return obj(_(a), _(b), _(c), _(d), _(e), _(f))
}

export { toObj }

////

export function _box({ x, y, width, height }: Box) {
  return {
    x: _(x),
    y: _(y),
    width: _(width),
    height: _(height),
  }
}

////

export const _ = (v: number) => expect.closeTo(v, 0)
