import type { LabelText } from '../../../types'
import type { BoxBox } from '../../box/prefixed'
import type { Cb } from '../../cb'

export type FloorProps = Readonly<{
  origViewBox: BoxBox
  fidx: number
  url?: string
  onAnimationEnd?: Cb
  labels?: readonly LabelText[]
}>

export type FloorLabelsProps = Readonly<{
  fidx: number
  labels?: readonly LabelText[]
}>
