import { type BoxBox as Box } from '../box/prefixed'
import { type Layout } from './layout'

type ResizeEvent = { type: 'RESIZE' } | { type: 'EXPIRED' }
type ResizeContext = {
  prev: Box
  next: Box
  waited: number
  first: boolean
}
type ResizeEmitted = { type: 'LAYOUT'; layout: Layout; force: boolean }

export { type ResizeContext, type ResizeEmitted, type ResizeEvent }
