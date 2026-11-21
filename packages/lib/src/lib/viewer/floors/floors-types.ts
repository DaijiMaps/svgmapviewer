import type { FloorsConfig } from '../../../types'
import type { Cb } from '../../cb'

export interface FloorsContext {
  nurls: number
  urls: Map<number, string>
  fidx: number
  prevFidx: null | number
}

export type Init = { type: 'INIT'; base?: string; floorsConfig: FloorsConfig }
export type Select = { type: 'SELECT'; idx: number; force?: boolean }
export type SelectDone = { type: 'SELECT.DONE'; idx: number }
export type Image = { type: 'IMAGE'; fidx: number; url: string }
export type LevelUp = { type: 'LEVEL.UP' }
export type LevelDown = { type: 'LEVEL.DOWN' }
export type AnimationEnd = { type: 'ANIMATION.END'; idx: number }
export type Click = { type: 'CLICK'; idx: number }
export type FloorsEvents =
  | Init
  | Select
  | SelectDone
  | Image
  | LevelUp
  | LevelDown
  | AnimationEnd
  | Click
export type InitDone = {
  type: 'INIT.DONE'
  base?: string
  floorsConfig: FloorsConfig
}
export type Lock = { type: 'LOCK'; idx: number }
export type FloorsEmits = InitDone | Lock | SelectDone

export type FidxToOnAnimationEnd = (fidx: number, idx: number) => undefined | Cb
export type FidxToOnClick = (
  fidx: number,
  prevFidx: null | number,
  idx: number
) => undefined | Cb
