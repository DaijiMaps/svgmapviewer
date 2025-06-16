import { type PropsWithChildren, type ReactNode } from 'react'
import { balloonPaths, balloonStyle } from './lib/balloon'
import { boxToViewBox2 } from './lib/box/prefixed'
import {
  pointer_events_none,
  position_absolute_left_0_top_0,
  Z_INDEX_BALLOON,
} from './lib/css'
import { openCloseIsVisible } from './lib/openclose'
import { type Dir } from './lib/types'
import { useOpenCloseDetail } from './lib/ui-xstate'
import { type VecVec } from './lib/vec/prefixed'

export interface BalloonProps {
  _p: null | VecVec
  _dir: null | Dir
  _W: number
  _H: number
}

export function Balloon(
  props: Readonly<PropsWithChildren<BalloonProps>>
): ReactNode {
  return (
    <div className="balloon-container">
      <BalloonSvg {...props} />
      {props.children}
      <style>{style}</style>
    </div>
  )
}

const style = `
.balloon-container,
.balloon-svg {
  ${position_absolute_left_0_top_0}
  ${pointer_events_none}
  z-index: ${Z_INDEX_BALLOON};
  will-change: opacity, transform;
}

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

function BalloonSvg(
  props: Readonly<PropsWithChildren<BalloonProps>>
): ReactNode {
  const _dir = props._dir
  if (_dir === null) {
    return <svg />
  }

  const { viewBox, width, height, fg, bg } = balloonPaths(
    _dir,
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
    </svg>
  )
}

export function BalloonStyle(props: Readonly<BalloonProps>): ReactNode {
  const { _p: o, _dir: dir } = props

  const detail = useOpenCloseDetail()

  const style =
    o === null || dir === null || !openCloseIsVisible(detail)
      ? `.balloon-container, .detail { display: none; }`
      : balloonStyle(detail, o, dir, props._W, props._H)

  return <style>{style}</style>
}
