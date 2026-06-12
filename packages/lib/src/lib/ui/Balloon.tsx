/* eslint-disable functional/no-expression-statements */
import { useMemo, useRef, type PropsWithChildren, type ReactNode } from 'react'

import { type HV } from '../../types'
import { boxToViewBox2 } from '../box/prefixed'
import {
  pointer_events_none,
  position_absolute_left_0_top_0,
  Z_INDEX_BALLOON,
} from '../css'
import { type VecVec } from '../vec/prefixed'
import {
  balloonPaths,
  calcBalloonLayout,
  type BalloonSize,
  type LegLayout,
} from './balloon-common'
import { useBalloonStyleRef, useDetailStyleRef } from './style'
import type { UiDetailContent } from './ui-types'

export interface BalloonProps {
  _p: null | VecVec
  _hv: null | HV
  _W: number
  _H: number
  _size: BalloonSize
  _leg: LegLayout
}

export function Balloon(
  props: Readonly<PropsWithChildren<{ _detail: UiDetailContent }>>
): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useDetailStyleRef(ref, 'balloon')
  useBalloonStyleRef(ref, 'balloon')

  return (
    <div ref={ref} className="balloon">
      <BalloonSvg {...props} />
      {props.children}
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

function BalloonSvg(
  props: Readonly<PropsWithChildren<{ _detail: UiDetailContent }>>
): ReactNode {
  const x = useMemo(() => calcBalloonLayout(props._detail), [props._detail])
  const { viewBox, width, height, fg, bg } = useMemo(
    () =>
      x._hv === null
        ? {
            viewBox: undefined,
            width: undefined,
            height: undefined,
            fg: undefined,
            bg: undefined,
          }
        : balloonPaths(x._hv, x._size),
    [x._size, x._hv]
  )

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
