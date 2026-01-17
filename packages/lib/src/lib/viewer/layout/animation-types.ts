//import { type Readonly } from 'type-fest'
import { type Box } from '../../box'
import { type VecVec as Vec } from '../../vec/prefixed'
import type { Z } from '../../../types'

export type AnimationReq =
  | Readonly<{ readonly type: 'zoom'; readonly z: Z; readonly p: Vec }>
  | Readonly<{ readonly type: 'home' }>
  | Readonly<{ readonly type: 'rotate'; readonly deg: number; readonly p: Vec }>

export type AnimationMove = Readonly<{
  type: 'Move'
  q: DOMMatrixReadOnly
  o: Vec
  move: Vec
}>

export type AnimationZoom = Readonly<{
  type: 'Zoom'
  q: DOMMatrixReadOnly
  o: null | Vec
  svg: Box
  svgScale: number
}>

export type AnimationRotate = Readonly<{
  type: 'Rotate'
  q: DOMMatrixReadOnly
  o: Vec
  deg: number
}>

export type Animation = AnimationMove | AnimationZoom | AnimationRotate
