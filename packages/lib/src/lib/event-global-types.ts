import type { SvgMapViewerConfig } from '../types'

import { type Cb, type Cb1 } from './cb'

export type InitCb = Cb1<Readonly<SvgMapViewerConfig>>

export interface GlobalCbs {
  readonly init: Set<InitCb>
  readonly rendered: Set<Cb>
}
