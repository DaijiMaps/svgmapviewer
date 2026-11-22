import type { LabelText } from '../../../types'
import type { BoxBox } from '../../box/prefixed'
import type { Cb } from '../../cb'

export type FloorProps = Readonly<{
  origViewBox: BoxBox
  names: readonly string[]
  onAnimationEnd?: Cb
  labels?: readonly LabelText[]
}>

export type FloorLabelsProps = Readonly<{
  fidx: number
  labels?: readonly LabelText[]
}>
