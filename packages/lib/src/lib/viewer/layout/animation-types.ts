import type { AnimationMatrix, Z } from '../../../types'
//import { type Readonly } from 'type-fest'
import { type Box } from '../../box'
import { type VecVec as Vec } from '../../vec/prefixed'

export type AnimationReq =
  | Readonly<{ readonly type: 'zoom'; readonly z: Z; readonly p: Vec }>
  | Readonly<{ readonly type: 'home' }>
  | Readonly<{ readonly type: 'rotate'; readonly deg: number; readonly p: Vec }>

export type AnimationMove = Readonly<{
  type: 'Move'
  q: AnimationMatrix
  move: Vec
}>

export type AnimationZoom = Readonly<{
  type: 'Zoom'
  q: AnimationMatrix
  svg: Box
  svgScale: number
}>

export type AnimationRotate = Readonly<{
  type: 'Rotate'
  q: AnimationMatrix
  deg: number
}>

export type Animation = AnimationMove | AnimationZoom | AnimationRotate
