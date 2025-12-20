import type { VecVec } from '../vec/prefixed'

export interface Size {
  width: number
  height: number
}

export type Box = Readonly<VecVec & Size>
