//import { type Readonly } from 'type-fest'
import { type Box } from '../../box'
import { type VecVec as Vec } from '../../vec/prefixed'
import { type Scale } from './transform'

export type AnimationMove = Readonly<{
  move: Vec
  q: DOMMatrixReadOnly
  o: Vec
}>

export type AnimationZoom = Readonly<{
  svg: Box
  svgScale: Scale
  q: DOMMatrixReadOnly
  o: null | Vec
}>

export type AnimationRotate = Readonly<{
  deg: number
  q: DOMMatrixReadOnly
  o: Vec
}>

export type Animation = Readonly<{
  move: null | AnimationMove
  zoom: null | AnimationZoom
  rotate: null | AnimationRotate
}>
