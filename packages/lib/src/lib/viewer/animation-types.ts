//import { type Readonly } from 'type-fest'
import { type Box } from '../box'
import { type MatrixMatrix as Matrix } from '../matrix/prefixed'
import { type VecVec as Vec } from '../vec/prefixed'
import { type Scale } from './transform'

export type AnimationMove = Readonly<{
  move: Vec
  q: Matrix
}>

export type AnimationZoom = Readonly<{
  svg: Box
  svgScale: Scale
  q: Matrix
}>

export type Animation = Readonly<{
  move: null | AnimationMove
  zoom: null | AnimationZoom
}>
