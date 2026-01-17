/* eslint-disable functional/no-throw-statements */

import type { MatrixObject } from './object'

type M = number[]

function N(n?: number) {
  return n !== undefined && typeof n === 'number'
}

export function make(
  a?: Readonly<number | M>,
  b?: number,
  c?: number,
  d?: number,
  e?: number,
  f?: number
): DOMMatrixReadOnly {
  const m: undefined | M =
    a instanceof Array
      ? (a as M)
      : N(a) && N(b) && N(c) && N(d) && N(e) && N(f)
        ? ([a, b, c, d, e, f] as M)
        : undefined
  return new DOMMatrixReadOnly(m)
}

function scaleOnly(m: DOMMatrixReadOnly): DOMMatrixReadOnly
function scaleOnly(sx: number, sy: number): DOMMatrixReadOnly
function scaleOnly(
  sx: DOMMatrixReadOnly | number,
  sy?: number
): DOMMatrixReadOnly {
  const m: undefined | number[] =
    sx instanceof DOMMatrixReadOnly
      ? [sx.a, 0, 0, sx.d, 0, 0]
      : typeof sx === 'number' && typeof sy === 'number'
        ? [sx, 0, 0, sy, 0, 0]
        : undefined
  if (m !== undefined) {
    return make(m)
  } else {
    throw new Error('dommatrixreadonlyTranslateOnly')
  }
}

function translateOnly(m: DOMMatrixReadOnly): DOMMatrixReadOnly
function translateOnly(x: number, y: number): DOMMatrixReadOnly
function translateOnly(
  x: DOMMatrixReadOnly | number,
  y?: number
): DOMMatrixReadOnly {
  if (x instanceof DOMMatrixReadOnly) {
    return make(1, 0, 0, 1, x.e, x.f)
  }
  if (typeof x === 'number' && typeof y === 'number') {
    return make(1, 0, 0, 1, x, y)
  }
  throw new Error('dommatrixreadonlyTranslateOnly')
}

function scaleAt(
  sx: number,
  sy: number,
  x: number,
  y: number
): DOMMatrixReadOnly {
  return make().scale(sx, sy, 1, x, y, 0)
}

function rotateAt(deg: number, x: number, y: number): DOMMatrixReadOnly {
  return make().translate(x, y).rotate(deg).translate(-x, -y)
}

function translate(x: number, y: number): DOMMatrixReadOnly {
  return make().translate(x, y)
}

// XXX
// XXX
// XXX
export function scaleTranslateOnly(
  m: DOMMatrixReadOnly,
  sx: number,
  sy: number
): DOMMatrixReadOnly {
  return make(1, 0, 0, 1, m.e * sx, m.f * sy)
}
// XXX
// XXX
// XXX

function toObj({ a, b, c, d, e, f }: DOMMatrixReadOnly): MatrixObject {
  return { a, b, c, d, e, f }
}

function fromObj({ a, b, c, d, e, f }: MatrixObject): DOMMatrixReadOnly {
  return make(a, b, c, d, e, f)
}

export {
  make as dommatrixreadonly,
  scaleOnly as dommatrixreadonlyScaleOnly,
  translateOnly as dommatrixreadonlyTranslateOnly,
  scaleAt as dommatrixreadonlyScaleAt,
  rotateAt as dommatrixreadonlyRotateAt,
  translate as dommatrixreadonlyTranslate,
  scaleTranslateOnly as dommatrixreadonlyScaleTranslateOnly,
  toObj as dommatrixreadonlyToObject,
  fromObj as dommatrixreadonlyFromObject,
}
