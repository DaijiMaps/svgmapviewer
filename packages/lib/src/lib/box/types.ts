import type { VecVec } from '../vec/prefixed'

export interface Size {
  readonly width: number
  readonly height: number
}

export type Box = Readonly<VecVec & Size>
