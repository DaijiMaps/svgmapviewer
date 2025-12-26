import { type BoxBox } from '../box/prefixed'
import { type Layout } from './layout/layout'

export type ResizeEvent = { type: 'RESIZE' } | { type: 'EXPIRED' }

export type ResizeEmitted = { type: 'LAYOUT'; layout: Layout; force: boolean }

export type ResizeContext = {
  prev: BoxBox
  next: BoxBox
  waited: number
  first: boolean
}
