import { type BoxBox as Box } from './box/prefixed'
import { type VecVec as Vec } from './vec/prefixed'

const arrayFromPoint = (p: Vec): number[] => [p.x, p.y]
const arrayFromBox = (b: Box): number[] => [b.x, b.y, b.width, b.height]

//// showNumber
//// showArray

export function showBoolean(b: boolean): string {
  return showNumber(Number(b))
}
export function showNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toPrecision(4)
}
export function showArray(a: Readonly<number[]>): string {
  return a.map(showNumber).join(' ')
}

//// showPoint
//// showBox
//// showDOMMatrixReadOnly

export const showPoint = (p: null | Vec): string =>
  p === null ? '-' : showArray(arrayFromPoint(p))
export const showBox = (b: Box): string => showArray(arrayFromBox(b))
