import type { Cb } from '../cb'

export interface FloorsContext {
  fidx: number
  prevFidx: null | number
  // XXX images: Map<number, ArrayBuffer>
}

export type Select = { type: 'SELECT'; fidx: number; force?: boolean }
export type SelectDone = { type: 'SELECT.DONE'; fidx: number }
export type Image = { type: 'IMAGE'; fidx: number; buf: ArrayBuffer }
export type FloorsEvents = Select | SelectDone | Image

export type FidxToOnAnimationEnd = (idx: number) => undefined | Cb
export type FidxToOnClick = (idx: number) => undefined | Cb
