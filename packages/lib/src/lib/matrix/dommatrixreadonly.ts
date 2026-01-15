export type MatrixObject = Readonly<{
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
}>

export function matrixObject(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
): MatrixObject {
  return { a, b, c, d, e, f }
}

export function toMatrixObject({
  a,
  b,
  c,
  d,
  e,
  f,
}: DOMMatrixReadOnly): MatrixObject {
  return { a, b, c, d, e, f }
}

export function fromMatrixObject({
  a,
  b,
  c,
  d,
  e,
  f,
}: MatrixObject): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly([a, b, c, d, e, f])
}

export function dommatrixreadonlyMakeScaleOnly(
  sx: number,
  sy: number
): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly([sx, 0, 0, sy, 0, 0])
}

export function dommatrixreadonlyMakeTranslateOnly(
  x: number,
  y: number
): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly([1, 0, 0, 1, x, y])
}

export function dommatrixreadonlyScaleAt(
  m: DOMMatrixReadOnly,
  sx: number,
  sy: number,
  x: number,
  y: number
): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly().scale(sx, sy, 1, x, y, 0).multiply(m)
}

export function dommatrixreadonlyRotateAt(
  m: DOMMatrixReadOnly,
  deg: number,
  x: number,
  y: number
): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly()
    .translate(x, y)
    .rotate(deg)
    .translate(-x, -y)
    .multiply(m)
}

export function dommatrixreadonlyTranslate(
  m: DOMMatrixReadOnly,
  x: number,
  y: number
): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly().translate(x, y).multiply(m)
}

export function dommatrixreadonlyTranslateOnly(
  m: DOMMatrixReadOnly
): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly([1, 0, 0, 1, m.e, m.f])
}

export function dommatrixreadonlyScaleTranslateOnly(
  m: DOMMatrixReadOnly,
  sx: number,
  sy: number
): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly([1, 0, 0, 1, m.e * sx, m.f * sy])
}
