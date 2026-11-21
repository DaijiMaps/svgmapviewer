import type { FloorsConfig } from '../../../types'
import type { Cb } from '../../cb'

export interface FloorsContext {
  nurls: number
  urls: Map<number, string>
  fidx: number
  prevFidx: null | number
}

export type Init = { type: 'INIT'; base?: string; floorsConfig: FloorsConfig }
export type Select = { type: 'SELECT'; fidx: number; force?: boolean }
export type SelectDone = { type: 'SELECT.DONE'; fidx: number }
export type Image = { type: 'IMAGE'; fidx: number; url: string }
export type LevelUp = { type: 'LEVEL.UP' }
export type LevelDown = { type: 'LEVEL.DOWN' }
export type FloorsEvents =
  Init | Select | SelectDone | Image | LevelUp | LevelDown
export type InitDone = {
  type: 'INIT.DONE'
  base?: string
  floorsConfig: FloorsConfig
}
export type Lock = { type: 'LOCK'; fidx: number }
export type FloorsEmits = InitDone | Lock

export type FidxToOnAnimationEnd = (fidx: number, idx: number) => undefined | Cb
export type FidxToOnClick = (
  fidx: number,
  prevFidx: null | number,
  idx: number
) => undefined | Cb
