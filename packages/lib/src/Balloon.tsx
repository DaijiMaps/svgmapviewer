import { useSelector } from '@xstate/react'
import { ReactNode } from 'react'
import './Balloon.css'
import { OpenClose, openCloseIsVisible } from './lib/openclose'
import { Dir, SearchRes } from './lib/types'
import {
  UiRef,
  selectOpenCloseBalloon,
  selectOpenCloseDetail,
} from './lib/ui-xstate'
import { Vec } from './lib/vec'
import { VecVec } from './lib/vec/prefixed'

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

function BalloonPath(props: Readonly<BalloonPathProps>) {
  const { fg, d, dir, ll, bw, bh } = props

  const hbw = bw / 2
  const hbh = bh / 2

  const lw = bw / 20
  const hlw = lw / 2

  const body = `
m${-hbw},${-hbh}
h${bw}
v${bh}
h${-bw}
z
`
  const leg =
    dir === 0
      ? `
m${-hlw},${-hbh}
l${hlw},${-ll}
l${hlw},${ll}
z
`
      : dir === 1
        ? `
m${hbw},${-hlw}
l${ll},${hlw}
l${-ll},${hlw}
z
`
        : dir === 2
          ? `
m${-hlw},${hbh}
l${hlw},${ll}
l${hlw},${-ll}
z
`
          : `
m${-hbw},${-hlw}
l${-ll},${hlw}
l${ll},${hlw}
`

  const dd = fg ? 0 : d
  const path = `M0,0 m${dd},${dd} ${body} M0,0 m${dd},${dd} ${leg}`

  return <path className={fg ? 'fg' : 'bg'} d={path} />
}

export interface BalloonProps {
  _uiRef: UiRef
  _detail: SearchRes
  _p: VecVec
  _dir: Dir
  _W: number
  _H: number
}

const BW = 50
const BH = 50
const BL = 10

export function Balloon(props: Readonly<BalloonProps>): ReactNode {
  const { _uiRef: uiRef } = props

  const balloon = useSelector(uiRef, selectOpenCloseBalloon)

  // XXX
  const vmin = Math.min(props._W, props._H) * 0.01

  const bw = vmin * BW
  const bh = vmin * BH
  const ll = vmin * BL

  const d = bw / 100

  const ww = bw + 2 * ll + 2 * d
  const hh = bh + 2 * ll + 2 * d

  const p = { vmin, bw, bh, ll, d, ww, hh }

  return !openCloseIsVisible(balloon) ? (
    <></>
  ) : (
    <div
      className="balloon-container"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiRef.send({ type: 'BALLOON.ANIMATION.END' })}
    >
      <svg
        className="balloon"
        viewBox={`${-ww / 2} ${-ww / 2} ${ww} ${hh}`}
        width={ww}
        height={hh}
      >
        <BalloonPath dir={props._dir} {...p} fg={false} />
        <BalloonPath dir={props._dir} {...p} fg={true} />
      </svg>
    </div>
  )
}

export function BalloonStyle(props: Readonly<BalloonProps>): ReactNode {
  const { _uiRef: uiRef, _detail: content, _p: o, _dir: dir } = props

  const balloon = useSelector(uiRef, selectOpenCloseBalloon)
  const detail = useSelector(uiRef, selectOpenCloseDetail)

  // XXX
  const vmin = Math.min(props._W, props._H) * 0.01

  const bw = vmin * BW
  const bh = vmin * BH
  const ll = vmin * BL

  const d = bw / 100

  const ww = bw + 2 * ll + 2 * d
  const hh = bh + 2 * ll + 2 * d

  const p = { dir, vmin, bw, bh, ll, d, ww, hh, fg: true }

  if (
    !openCloseIsVisible(balloon) ||
    !openCloseIsVisible(detail) ||
    content === null
  ) {
    return <style>{`.detail { display: none; }`}</style>
  } else {
    return <style>{balloonStyle(balloon, o, dir, p)}</style>
  }
}

function balloonStyle(
  { open, animating }: OpenClose,
  Q: null | Vec,
  dir: null | Dir,
  p: Readonly<BalloonPathProps>
) {
  if (Q === null || dir === null) {
    return ``
  }
  const dPs = [
    { x: 0, y: p.hh / 2 },
    { x: -p.ww / 2, y: 0 },
    { x: 0, y: -p.hh / 2 },
    { x: p.ww / 2, y: 0 },
  ]
  const dP = dPs[dir]

  if (!animating) {
    return `
.detail {
  transform-origin: 0 0;
  transform: translate(${Q.x + dP.x}px, ${Q.y + dP.y}px) scale(1) translate(-50%, -50%);
}

.balloon-container {
  transform-origin: 0 0;
  transform: translate(${Q.x + dP.x}px, ${Q.y + dP.y}px) scale(1) translate(${-p.ww / 2}px, ${-p.hh / 2}px);
}
`
  } else {
    return `
.detail,
.balloon-container {
  transition: transform 300ms;
}

.detail {
  transform-origin: 0 0;
  animation: xxx-detail 300ms ease ${open ? `normal` : `reverse`};
  will-change: opacity transform;
}

.balloon-container {
  transform-origin: 0 0;
  animation: xxx-balloon 300ms ease ${open ? `normal` : `reverse`};
  will-change: opacity transform;
}

@keyframes xxx-detail {
  from {
    opacity: 0;
    transform: translate(${Q.x}px, ${Q.y}px) scale(0) translate(-50%, -50%);
  }
  to {
    opacity: 1;
    transform: translate(${Q.x + dP.x}px, ${Q.y + dP.y}px) scale(1) translate(-50%, -50%);
  }
}

@keyframes xxx-balloon {
  from {
    opacity: 0;
    transform: translate(${Q.x}px, ${Q.y}px) scale(0) translate(${-p.ww / 2}px, ${-p.hh / 2}px);
  }
  to {
    opacity: 1;
    transform: translate(${Q.x + dP.x}px, ${Q.y + dP.y}px) scale(1) translate(${-p.ww / 2}px, ${-p.hh / 2}px);
  }
}
`
  }
}
