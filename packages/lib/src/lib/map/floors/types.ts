import type { LabelText } from '../../../types'
import type { BoxBox } from '../../box/prefixed'
import type { Cb } from '../../cb'

export type FloorProps = Readonly<{
  origViewBox: BoxBox
  idx: number
  url?: string
  onAnimationEnd?: Cb
  labels?: readonly LabelText[]
}>
