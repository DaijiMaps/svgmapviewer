import { type PropsWithChildren, type ReactNode } from 'react'
import { balloonPaths, balloonStyle } from './lib/balloon'
import { boxToViewBox2 } from './lib/box/prefixed'
import {
  pointer_events_none,
  position_absolute_left_0_top_0,
  Z_INDEX_BALLOON,
} from './lib/css'
import { openCloseIsVisible } from './lib/openclose'
import { type Dir, type HV } from './lib/types'
import { useOpenCloseDetail } from './lib/ui-xstate'
import { type VecVec } from './lib/vec/prefixed'

export interface BalloonProps {
  _p: null | VecVec
  _dir: null | Dir
  _hv: null | HV
  _W: number
  _H: number
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
  const _dir = props._dir
  const _hv = props._hv
  if (_dir === null || _hv === null) {
    return <svg />
  }

  const { viewBox, width, height, fg, bg } = balloonPaths(
    _dir,
    _hv,
    props._W,
    props._H
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
  _dir,
  _hv,
  _W,
  _H,
}: Readonly<BalloonProps>): ReactNode {
  const detail = useOpenCloseDetail()

  const style =
    _p === null || _dir === null || _hv === null || !openCloseIsVisible(detail)
      ? `.balloon, .detail { display: none; }`
      : balloonStyle(detail, _p, _dir, _hv, _W, _H)

  return <style>{style}</style>
}
