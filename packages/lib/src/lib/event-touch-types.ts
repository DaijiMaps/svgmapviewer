import type { Zoom } from '../types'
import type { Cb, Cb1 } from './cb'

export type TouchZoomCb = Cb1<Zoom>

export interface TouchCbs {
  readonly multiStart: Set<Cb>
  readonly multiEnd: Set<Cb>
  readonly zoom: Set<TouchZoomCb>
}
