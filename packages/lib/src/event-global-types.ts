import { type Cb, type Cb1 } from './lib/cb'
import type { SvgMapViewerConfig } from './types'

export type InitCb = Cb1<Readonly<SvgMapViewerConfig>>

export interface GlobalCbs {
  init: Set<InitCb>
  rendered: Set<Cb>
}
