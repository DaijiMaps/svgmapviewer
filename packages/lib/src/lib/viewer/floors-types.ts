import type { Cb } from '../cb'

export interface FloorsContext {
  fidx: number
  prevFidx: null | number
}

export type Select = { type: 'SELECT'; fidx: number; force?: boolean }
export type Done = { type: 'DONE'; fidx: number }
export type FloorsEvents = Select | Done

export type FidxToOnAnimationEnd = (idx: number) => undefined | Cb
export type FidxToOnClick = (idx: number) => undefined | Cb
