import type { Zoom } from '../types'
import type { Cb, Cb1 } from './cb'
import type { VecVec } from './vec/prefixed'

export type TouchMultiEndCb = Cb1<{ p?: VecVec; s?: number }>
export type TouchZoomCb = Cb1<Zoom>

export interface TouchCbs {
  readonly multiStart: Set<Cb>
  readonly multiEnd: Set<TouchMultiEndCb>
  readonly zoom: Set<TouchZoomCb>
}
