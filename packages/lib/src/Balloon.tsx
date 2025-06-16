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

export interface BalloonPathProps {
  dir: Dir
  vmin: number
  bw: number
  bh: number
  ll: number
  d: number
  ww: number
  hh: number
  fg: boolean
}

export interface BalloonProps {
  _p: null | VecVec
  _dir: null | Dir
  _W: number
  _H: number
}

const BW = 50
const BH = 50
const BL = 10

export function Balloon(
  props: Readonly<PropsWithChildren<BalloonProps>>
): ReactNode {
  const _dir = props._dir
  if (_dir === null) {
    return <></>
  }

  const { viewBox, width, height, fg, bg } = balloonPaths({ ...props, _dir })

  return (
    <div className="balloon-container">
      <svg
        className="balloon"
        viewBox={boxToViewBox2(viewBox)}
        width={width}
        height={height}
      >
        <path className="bg" d={bg} />
        <path className="fg" d={fg} />
      </svg>
      {props.children}
      <style>{style}</style>
    </div>
  )
}

const style = `
.balloon-container,
.balloon {
  ${position_absolute_left_0_top_0}
  ${pointer_events_none}
  z-index: ${Z_INDEX_BALLOON};
  will-change: opacity, transform;
}

.balloon > path.bg {
  fill: black;
  stroke: none;
}

.balloon > path.fg {
  fill: white;
  stroke: white;
  stroke-width: 1px;
}
`

export function BalloonStyle(props: Readonly<BalloonProps>): ReactNode {
  const { _p: o, _dir: dir } = props

  //const balloon = useOpenCloseBalloon()
  const detail = useOpenCloseDetail()

  // XXX
  const vmin = Math.min(props._W, props._H) * 0.01

  const bw = vmin * BW
  const bh = vmin * BH
  const ll = vmin * BL

  const d = bw / 100

  const ww = bw + 2 * ll + 2 * d
  const hh = bh + 2 * ll + 2 * d

  if (o === null || dir === null || !openCloseIsVisible(detail)) {
    return <style>{`.balloon-container, .detail { display: none; }`}</style>
  } else {
    return <style>{balloonStyle(detail, o, dir, ww, hh)}</style>
  }
}
