import type { Cb, Cb1 } from './lib/cb'
import type { Zoom } from './types'

export type TouchZoomCb = Cb1<Zoom>

export interface TouchCbs {
  multiStart: Set<Cb>
  multiEnd: Set<Cb>
  zoom: Set<TouchZoomCb>
}
