import type { Cb } from '../../cb'

export interface FloorsContext {
  nfloors: number
  blobs: Map<number, Blob>
  urls: Map<number, string>
  fidx: number
  prevFidx: null | number
}

export type Init = { type: 'INIT'; nfloors: number; fidx: number }
export type Select = { type: 'SELECT'; fidx: number; force?: boolean }
export type SelectDone = { type: 'SELECT.DONE'; fidx: number }
export type Image = { type: 'IMAGE'; fidx: number; blob: Blob }
export type LevelUp = { type: 'LEVEL.UP' }
export type LevelDown = { type: 'LEVEL.DOWN' }
export type FloorsEvents =
  | Init
  | Select
  | SelectDone
  | Image
  | LevelUp
  | LevelDown
export type Lock = { type: 'LOCK'; fidx: number }
export type FloorsEmits = Lock

export type FidxToOnAnimationEnd = (idx: number) => undefined | Cb
export type FidxToOnClick = (idx: number) => undefined | Cb
