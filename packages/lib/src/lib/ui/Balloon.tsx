import { type PropsWithChildren, type ReactNode } from 'react'
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
  balloonStyle,
  type BalloonSize,
  type LegLayout,
} from './balloon-common'
import { openCloseIsVisible } from './openclose'
import { useOpenCloseDetail } from './ui-react'

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
  return (
    <div className="balloon">
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
  if (_hv === null) {
    return <svg />
  }

  const { viewBox, width, height, fg, bg } = balloonPaths(_hv, props._size)

  return (
    <svg
      className="balloon-svg"
      viewBox={boxToViewBox2(viewBox)}
      width={width}
      height={height}
    >
      <path className="bg" d={bg} />
      <path className="fg" d={fg} />
      <style>{`
path.bg {
  fill: black;
  stroke: none;
}

path.fg {
  fill: white;
  stroke: white;
  stroke-width: 1px;
}
`}</style>
    </svg>
  )
}

export function DetailBalloonStyle({
  _p,
  _hv,
  _size,
  _leg,
}: Readonly<BalloonProps>): ReactNode {
  const detail = useOpenCloseDetail()

  const style =
    _p === null || _hv === null || !openCloseIsVisible(detail)
      ? `.balloon, .detail { visibility: hidden; }`
      : balloonStyle(detail, _p, _hv, _size, _leg)

  return <style>{style}</style>
}
