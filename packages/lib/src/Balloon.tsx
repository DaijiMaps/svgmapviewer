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
import { VecVec, vecVec } from './lib/vec/prefixed'

export interface BalloonPathProps {
  fg: boolean
  d: number
  dir: Dir
  ll: number
  bw: number
  bh: number
}

function BalloonPath(props: Readonly<BalloonPathProps>) {
  const { fg, d, dir, ll, bw, bh } = props

  const hbw = bw / 2
  const hbh = bh / 2

  const lw = bw / 20
  const hlw = lw / 2

  // XXX refactor
  const path =
    dir === 0
      ? `
M${hbw + d},${-ll + d}
l${hlw},${ll}
l${hbw - hlw},0
l0,${bh}
l${-bw},0
l0,${-bh}
l${hbw - hlw},0
z
`
      : dir === 1
        ? `
M${bw + ll + d},${hbh + d}
l${-ll},${hlw}
l0,${hbh - hlw}
l${-bw},0
l0,${-bh}
l${bw},0
l0,${hbh - hlw}
z
`
        : dir === 2
          ? `
M${hbw + d},${bh + ll + d}
l${-hlw},${-ll}
l${-(hbw - hlw)},0
l0,${-bh}
l${bw},0
l0,${bh}
l${-(hbw - hlw)},0
z
`
          : `
M${-ll + d},${hbh + d}
l${ll},${-hlw}
l0,${-(hbh - hlw)}
l${bw},0
l0,${bh}
l${-bw},0
l0,${-(hbh - hlw)}
z
`

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

export function Balloon(props: Readonly<BalloonProps>): ReactNode {
  const { _uiRef: uiRef } = props

  const balloon = useSelector(uiRef, selectOpenCloseBalloon)

  // XXX
  const vmin = Math.min(props._W, props._H) * 0.01

  const bw = vmin * 40
  const bh = vmin * 40
  const ll = vmin * 10

  const d = bw / 100

  const p = { ll, bw, bh }

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
        viewBox={`${-ll} ${-ll} ${bw + ll * 2 + d} ${bh + ll * 2 + d}`}
      >
        <BalloonPath fg={false} d={d} dir={props._dir} {...p} />
        <BalloonPath fg={true} d={0} dir={props._dir} {...p} />
      </svg>
    </div>
  )
}

export function BalloonStyle(props: Readonly<BalloonProps>): ReactNode {
  const { _uiRef: uiRef, _detail: content, _p: p, _dir: dir } = props

  const balloon = useSelector(uiRef, selectOpenCloseBalloon)
  const detail = useSelector(uiRef, selectOpenCloseDetail)

  if (
    !openCloseIsVisible(balloon) ||
    !openCloseIsVisible(detail) ||
    content === null
  ) {
    return <style>{`.detail { display: none; }`}</style>
  } else {
    return <style>{balloonStyle(balloon, p, dir)}</style>
  }
}

const ds: Vec[] = [
  vecVec(20, 0 - 10), // 0 - top
  vecVec(40 + 10, 20), // 1 - right
  vecVec(20, 40 + 10), // 2 - bottom
  vecVec(0 - 10, 20), // 3 - left
]

function balloonStyle(
  { open, animating }: OpenClose,
  o: null | Vec,
  dir: null | Dir
) {
  if (o === null || dir === null) {
    return ``
  }

  const d = ds[dir]

  if (!animating) {
    return `
.detail {
  transform-origin: ${d.x}vmin ${d.y}vmin;
  transform: translate(${o.x}px, ${o.y}px) translate(${-d.x}vmin, ${-d.y}vmin) scale(1);
}

.balloon-container {
  transform-origin: ${d.x + 10}vmin ${d.y + 10}vmin;
  transform: translate(${o.x}px, ${o.y}px) translate(${-d.x - 10}vmin, ${-d.y - 10}vmin) scale(1);
}
`
  } else {
    const opacityA = open ? 0 : 1
    const opacityB = open ? 1 : 0
    const scaleA = open ? 0 : 1
    const scaleB = open ? 1 : 0

    return `
.detail,
.balloon-container {
  transition: transform 300ms;
}

.detail {
  transform-origin: ${d.x}vmin ${d.y}vmin;
  animation: xxx-detail 300ms ease;
  will-change: opacity transform;
}

.balloon-container {
  transform-origin: ${d.x + 10}vmin ${d.y + 10}vmin;
  animation: xxx-balloon 300ms ease;
  will-change: opacity transform;
}

@keyframes xxx-detail {
  from {
    opacity: ${opacityA};
    transform: translate(${o.x}px, ${o.y}px) translate(${-d.x}vmin, ${-d.y}vmin) scale(${scaleA});
  }
  to {
    opacity: ${opacityB};
    transform: translate(${o.x}px, ${o.y}px) translate(${-d.x}vmin, ${-d.y}vmin) scale(${scaleB});
  }
}

@keyframes xxx-balloon {
  from {
    opacity: ${opacityA};
    transform: translate(${o.x}px, ${o.y}px) translate(${-d.x - 10}vmin, ${-d.y - 10}vmin) scale(${scaleA});
  }
  to {
    opacity: ${opacityB};
    transform: translate(${o.x}px, ${o.y}px) translate(${-d.x - 10}vmin, ${-d.y - 10}vmin) scale(${scaleB});
  }
}
`
  }
}
