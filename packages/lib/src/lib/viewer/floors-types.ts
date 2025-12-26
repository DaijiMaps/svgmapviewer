import type { Cb } from '../cb'

export interface FloorsContext {
  fidx: number
  prevFidx: null | number
  images: Map<number, Blob>
  nimages: number
}

export type Select = { type: 'SELECT'; fidx: number; force?: boolean }
export type SelectDone = { type: 'SELECT.DONE'; fidx: number }
export type Image = { type: 'IMAGE'; fidx: number; blob: Blob }
export type FloorsEvents = Select | SelectDone | Image

export type FidxToOnAnimationEnd = (idx: number) => undefined | Cb
export type FidxToOnClick = (idx: number) => undefined | Cb
