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
  useDetailStyle,
  type BalloonSize,
  type LegLayout,
} from './balloon-common'
import { useDetailStyleRef } from './ui-react'

export interface BalloonProps {
  _p: null | VecVec
  _hv: null | HV
  _W: number
  _H: number
  _size: BalloonSize
  _leg: LegLayout
}

export function Balloon(
  props: Readonly<PropsWithChildren<BalloonProps>>
): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useDetailStyleRef(ref, 'balloon')

  useDetailStyle(ref, props._p, props._hv, props._size, props._leg)

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
  props: Readonly<PropsWithChildren<BalloonProps>>
): ReactNode {
  const _hv = props._hv
  return _hv === null ? <svg /> : <BalloonSvg1 {...props} hv={_hv} />
}

function BalloonSvg1(
  props: Readonly<PropsWithChildren<BalloonProps> & { hv: HV }>
) {
  const { viewBox, width, height, fg, bg } = useMemo(
    () => balloonPaths(props.hv, props._size),
    [props._size, props.hv]
  )

  return (
    <svg
      className="balloon-svg"
      viewBox={boxToViewBox2(viewBox)}
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
