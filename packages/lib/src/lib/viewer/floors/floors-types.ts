import type { FloorsConfig } from '../../../types'
import type { Cb } from '../../cb'

export interface FloorsContext {
  nurls: number
  urls: Set<number>
  fidx: number
  prevFidx: null | number
}

export type Init = { type: 'INIT'; fcfg: FloorsConfig; base?: string }
export type Select = { type: 'SELECT'; idx: number; force?: boolean }
export type SelectDone = { type: 'SELECT.DONE'; idx: number }
export type Image = { type: 'IMAGE'; idx: number; url: string }
export type Click = { type: 'CLICK'; idx: number }
export type LevelUp = { type: 'LEVEL.UP' }
export type LevelDown = { type: 'LEVEL.DOWN' }
export type AnimationEnd = { type: 'ANIMATION.END'; idx: number }
export type FloorsEvents =
  | Init
  | Select
  | SelectDone
  | Image
  | Click
  | LevelUp
  | LevelDown
  | AnimationEnd
export type InitDone = {
  type: 'INIT.DONE'
  fcfg: FloorsConfig
  base?: string
}
export type Lock = { type: 'LOCK'; idx: number }
export type FloorsEmits = InitDone | Lock | SelectDone

export type FidxToOnAnimationEnd = (fidx: number, idx: number) => undefined | Cb
export type FidxToOnClick = (
  fidx: number,
  prevFidx: null | number,
  idx: number
) => undefined | Cb
