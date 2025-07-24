import { number, ord as ord_, ordering } from 'fp-ts'
import { type Vec } from './main'

export function compare(a: Vec, b: Vec): ordering.Ordering {
  return number.Ord.compare(a.x, b.x) || number.Ord.compare(a.y, b.y)
}

export const ord: ord_.Ord<Vec> = ord_.fromCompare(compare)
