import { type M, type V } from '../tuple'

export function translate([tx, ty]: V): M {
  return [
    [1, 0],
    [0, 1],
    [tx, ty],
  ]
}
