/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { useRef, type ReactNode } from 'react'

import { type HV } from '../../types'
import { boxToViewBox2 } from '../box/prefixed'
import {
  pointer_events_none,
  position_absolute_left_0_top_0,
  Z_INDEX_BALLOON,
} from '../css'
import { type VecVec } from '../vec/prefixed'
import {
  type BalloonPaths,
  type BalloonSize,
  type LegLayout,
} from './balloon-common'
import { useBalloonStyleRef, useDetailStyleRef } from './style'
import { useBalloonPaths } from './ui-xstate'

export interface BalloonProps {
  _p: null | VecVec
  _hv: null | HV
  _W: number
  _H: number
  _size: BalloonSize
  _leg: LegLayout
}

export function Balloon(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useDetailStyleRef(ref, 'balloon')
  useBalloonStyleRef(ref, 'balloon')

  const balloonPaths = useBalloonPaths()

  return (
    <div ref={ref} className="balloon">
      {balloonPaths && <BalloonSvg {...balloonPaths} />}
      <style>{style}</style>
    </div>
  )
}

const style = `
.balloon,
.balloon-svg {
  ${position_absolute_left_0_top_0}
  ${pointer_events_none}
  z-index: ${Z_INDEX_BALLOON};
  will-change: opacity, transform;
}
`

function BalloonSvg({
  viewBox,
  width,
  height,
  fg,
  bg,
}: Readonly<BalloonPaths>): ReactNode {
  return (
    <svg
      className="balloon-svg"
      viewBox={viewBox && boxToViewBox2(viewBox)}
      width={width}
      height={height}
    >
      <path className="bg" d={bg} />
      <path className="fg" d={fg} />
      <style>{style1}</style>
    </svg>
  )
}

const style1 = `
path.bg {
  fill: black;
  stroke: none;
}

path.fg {
  fill: white;
  stroke: white;
  stroke-width: 1px;
}
`
