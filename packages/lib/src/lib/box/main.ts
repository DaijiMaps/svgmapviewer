import type { Box } from './types'

import { type B, type V } from '../tuple'
//import { type Size } from '../../types'
import { type Vec } from '../vec'

//// Box

export function box(x: number, y: number, width: number, height: number): Box {
  return { x, y, width, height }
}

//// unit
//// copy
//// center
//// move
//// toViewbox

export const unit: Box = { x: 0, y: 0, width: 1, height: 1 }

export function eq(a: Box, b: Box): boolean {
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  )
}

export function copy(a: Box): Box {
  return { x: a.x, y: a.y, width: a.width, height: a.height }
}

export function center(o: Box): Vec {
  return { x: o.x + o.width * 0.5, y: o.y + o.height * 0.5 }
}

export function move(o: Box, v: Vec): Box {
  return { ...o, x: o.x + v.x, y: o.y + v.y }
}

export function moveTo(o: Box, v: Vec): Box {
  return { ...o, x: v.x, y: v.y }
}

export function map(
  { x, y, width, height }: Box,
  f: (n: number) => number
): Box {
  return {
    x: f(x),
    y: f(y),
    width: f(width),
    height: f(height),
  }
}

export function toViewBox({ x, y, width, height }: Box): string {
  return `${x} ${y} ${width} ${height}`
}

export function toViewBox2(box: Box): string {
  function trunc2(n: number): number {
    return Math.round(n * 100) / 100
  }
  return toViewBox(map(box, trunc2))
}

//// B

export function mapF([tl, br]: B, f: (_v: V) => V): B {
  return [f(tl), f(br)]
}
