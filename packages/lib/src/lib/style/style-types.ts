import {
  type AnimationMatrix,
  type CurrentScroll,
  type Dir,
  type Range,
} from '../../types'
import { type DistanceRadius } from '../distance-types'
import { type VecVec } from '../vec/prefixed'
import { type Layout } from '../viewer/layout'

export type LayoutEvent = {
  type: 'STYLE.LAYOUT'
  layout: Layout
  rendered: boolean
}
export type ZoomEvent = { type: 'STYLE.ZOOM'; zoom: number; z: null | Dir }
export type ScrollEvent = { type: 'STYLE.SCROLL'; currentScroll: CurrentScroll } // p == pscroll
export type ModeEvent = { type: 'STYLE.MODE'; mode: string }
export type AnimationEvent = {
  type: 'STYLE.ANIMATION'
  animation: null | AnimationMatrix
} // null to stop animation
export type AnimationEndEvent = { type: 'STYLE.ANIMATION.END' } // null to stop animation
export type LayoutDoneEvent = { type: 'LAYOUT.DONE'; rendered: boolean } // internal
export type StyleEvent =
  | LayoutEvent
  | ZoomEvent
  | ScrollEvent
  | ModeEvent
  | AnimationEvent
  | AnimationEndEvent
  | LayoutDoneEvent

export interface StyleContext {
  rendered: boolean
  appearing: boolean
  shown: boolean
  animating: boolean
  layout: Layout
  zoom: number
  z: null | Dir
  rotate: null | number
  svgMatrix: DOMMatrixReadOnly
  geoMatrix: DOMMatrixReadOnly
  geoPoint: VecVec
  distanceRadius: DistanceRadius
  geoRange: Range
  mode: string
  animation: null | AnimationMatrix
}
