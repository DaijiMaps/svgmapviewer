/* eslint-disable functional/functional-parameters */
import { type PropsWithChildren, type ReactNode } from 'react'
import { type OpenClose, openCloseIsVisible } from './lib/openclose'
import { type Dir, type SearchRes } from './lib/types'
import {
  uiSend,
  useOpenCloseBalloon,
  useOpenCloseDetail,
} from './lib/ui-xstate'
import { type Vec } from './lib/vec'
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

function balloonPath(props: Readonly<BalloonPathProps>): string {
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

  const rel = `m${fg ? 0 : d},${fg ? 0 : d}`

  const bodyPath = `M0,0 ${rel} ${body}`
  const legPath = `M0,0 ${rel} ${leg}`

  return bodyPath + legPath
}

export interface BalloonProps {
  _detail: null | SearchRes
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
  // XXX
  const vmin = Math.min(props._W, props._H) * 0.01

  const bw = vmin * BW
  const bh = vmin * BH
  const ll = vmin * BL

  const d = bw / 100

  const ww = bw + 2 * ll + 2 * d
  const hh = bh + 2 * ll + 2 * d

  const viewBox = `${-ww / 2} ${-ww / 2} ${ww} ${hh}`

  const p = { vmin, bw, bh, ll, d, ww, hh }

  const bgPath =
    props._dir === null ? '' : balloonPath({ dir: props._dir, ...p, fg: false })
  const fgPath =
    props._dir === null ? '' : balloonPath({ dir: props._dir, ...p, fg: true })

  return (
    <div
      className="balloon-container"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'BALLOON.ANIMATION.END' })}
    >
      <svg className="balloon" viewBox={viewBox} width={ww} height={hh}>
        <path className="bg" d={bgPath} />
        <path className="fg" d={fgPath} />
      </svg>
      {props.children}
      <style>{style}</style>
    </div>
  )
}

const style = `
.balloon-container,
.balloon {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 10;
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
  const { _detail: content, _p: o, _dir: dir } = props

  const balloon = useOpenCloseBalloon()
  const detail = useOpenCloseDetail()

  // XXX
  const vmin = Math.min(props._W, props._H) * 0.01

  const bw = vmin * BW
  const bh = vmin * BH
  const ll = vmin * BL

  const d = bw / 100

  const ww = bw + 2 * ll + 2 * d
  const hh = bh + 2 * ll + 2 * d

  if (
    content === null ||
    o === null ||
    dir === null ||
    !openCloseIsVisible(balloon) ||
    !openCloseIsVisible(detail)
  ) {
    return <>{`.balloon-container, .detail { display: none; }`}</>
  } else {
    const p = { dir, vmin, bw, bh, ll, d, ww, hh, fg: true }
    return <>{balloonStyle(balloon, o, dir, p)}</>
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
    const sb = 1
    const dxb = 'var(--dp-x)'
    const dyb = 'var(--dp-y)'

    return `
.detail,
.balloon-container {
  --q-x: ${Q.x}px;
  --q-y: ${Q.y}px;
  --dp-x: ${dP.x}px;
  --dp-y: ${dP.y}px;
}

.detail {
  transform-origin: 0 0;
  transform: translate(calc(var(--q-x) + ${dxb}), calc(var(--q-y) + ${dyb})) scale(${sb}) translate(-50%, -50%) translate3d(0px, 0px, 0px);
}

.balloon-container {
  transform-origin: 0 0;
  transform: translate(calc(var(--q-x) + ${dxb}), calc(var(--q-y) + ${dyb})) scale(${sb}) translate(${-p.ww / 2}px, ${-p.hh / 2}px) translate3d(0px, 0px, 0px);
}
`
  } else {
    const [oa, ob] = open ? [0, 1] : [1, 0]
    const [sa, sb] = open ? [0, 1] : [1, 0]
    const [dxa, dxb] = open ? ['0px', 'var(--dp-x)'] : ['var(--dp-x)', '0px']
    const [dya, dyb] = open ? ['0px', 'var(--dp-y)'] : ['var(--dp-y)', '0px']
    const t = open
      ? 'cubic-bezier(0.25, 0.25, 0.25, 1)'
      : 'cubic-bezier(0.75, 0, 0.75, 0.75)'

    return `
.detail,
.balloon-container {
  --q-x: ${Q.x}px;
  --q-y: ${Q.y}px;
  --dp-x: ${dP.x}px;
  --dp-y: ${dP.y}px;
}

.detail,
.balloon-container {
}

.detail {
  transform-origin: 0 0;
  animation: xxx-detail 300ms ${t};
  will-change: opacity transform;
}

.balloon-container {
  transform-origin: 0 0;
  animation: xxx-balloon 300ms ${t};
  will-change: opacity transform;
}

@keyframes xxx-detail {
  from {
    opacity: ${oa};
    transform: translate(calc(var(--q-x) + ${dxa}), calc(var(--q-y) + ${dya})) scale(${sa}) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: ${ob};
    transform: translate(calc(var(--q-x) + ${dxb}), calc(var(--q-y) + ${dyb})) scale(${sb}) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
}

@keyframes xxx-balloon {
  from {
    opacity: ${oa};
    transform: translate(calc(var(--q-x) + ${dxa}), calc(var(--q-y) + ${dya})) scale(${sa}) translate(${-p.ww / 2}px, ${-p.hh / 2}px) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: ${ob};
    transform: translate(calc(var(--q-x) + ${dxb}), calc(var(--q-y) + ${dyb})) scale(${sb}) translate(${-p.ww / 2}px, ${-p.hh / 2}px) translate3d(0px, 0px, 0px);
  }
}
`
  }
}
