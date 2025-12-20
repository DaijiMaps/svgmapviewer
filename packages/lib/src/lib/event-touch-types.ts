import type { Zoom } from '../types'
import type { Cb, Cb1 } from './cb'

export type TouchZoomCb = Cb1<Zoom>

export interface TouchCbs {
  multiStart: Set<Cb>
  multiEnd: Set<Cb>
  zoom: Set<TouchZoomCb>
}
