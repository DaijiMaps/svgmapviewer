//import { type Readonly } from 'type-fest'
import { type Box } from '../../box'
import { type VecVec as Vec } from '../../vec/prefixed'
import { type Scale } from './transform'

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
  svgScale: Scale
}>

export type AnimationRotate = Readonly<{
  type: 'Rotate'
  q: DOMMatrixReadOnly
  o: Vec
  deg: number
}>

export type Animation = AnimationMove | AnimationZoom | AnimationRotate
