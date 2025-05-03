import { VecVec } from '../vec/prefixed'

export interface POI {
  id: null | number
  name: string[]
  pos: VecVec
  size: number
  area?: number
}
