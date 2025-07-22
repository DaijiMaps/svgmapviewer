//import { type Readonly } from 'type-fest'
import { type Box } from '../box'
import { type VecVec as Vec } from '../vec/prefixed'
import { type Scale } from './transform'

export type AnimationMove = Readonly<{
  move: Vec
  q: DOMMatrixReadOnly
}>

export type AnimationZoom = Readonly<{
  svg: Box
  svgScale: Scale
  q: DOMMatrixReadOnly
}>

export type AnimationRotate = Readonly<{
  deg: number
  content: DOMMatrixReadOnly
}>

export type Animation = Readonly<{
  move: null | AnimationMove
  zoom: null | AnimationZoom
  rotate: null | AnimationRotate
}>
