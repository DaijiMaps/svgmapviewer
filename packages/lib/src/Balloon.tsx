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

/*
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
*/

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

  /*
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
  */

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

/*
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
  --sb: ${sb};
  --dp-x: ${dP.x}px;
  --dp-y: ${dP.y}px;
  --dxb: ${dxb};
  --dyb: ${dyb};
  --pww: ${-p.ww / 2}px;
  --phh: ${-p.hh / 2}px;
}

.detail {
  transform-origin: 0 0;
  transform: translate(calc(var(--q-x) + var(--dxb)), calc(var(--q-y) + var(--dyb))) scale(var(--sb)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
}

.balloon-container {
  transform-origin: 0 0;
  transform: translate(calc(var(--q-x) + var(--dxb)), calc(var(--q-y) + var(--dyb))) scale(var(--sb)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
}
`
  } else {
    const [oa, ob] = open ? [0, 1] : [1, 0]
    const [sa, sb] = open ? [0, 1] : [1, 0]
    const [dxa, dxb] = open ? ['0px', 'var(--dp-x)'] : ['var(--dp-x)', '0px']
    const [dya, dyb] = open ? ['0px', 'var(--dp-y)'] : ['var(--dp-y)', '0px']
    const t = open ? timing_opening : timing_closing

    return `
.detail,
.balloon-container {
  --q-x: ${Q.x}px;
  --q-y: ${Q.y}px;
  --dp-x: ${dP.x}px;
  --dp-y: ${dP.y}px;
  --oa: ${oa};
  --ob: ${ob};
  --sa: ${sa};
  --sb: ${sb};
  --timing: ${t};
  --dxa: ${dxa};
  --dxb: ${dxb};
  --dya: ${dya};
  --dyb: ${dyb};
  --pww: ${-p.ww / 2}px;
  --phh: ${-p.hh / 2}px;
  --duration: ${ZOOM_DURATION_DETAIL}ms;
}

.detail {
  transform-origin: 0 0;
  animation: xxx-detail var(--duration) var(--timing);
  will-change: opacity, transform;
}

.balloon-container {
  transform-origin: 0 0;
  animation: xxx-balloon var(--duration) var(--timing);
  will-change: opacity, transform;
}

@keyframes xxx-detail {
  from {
    opacity: var(--oa);
    transform: translate(calc(var(--q-x) + var(--dxa)), calc(var(--q-y) + var(--dya))) scale(var(--sa)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--ob);
    transform: translate(calc(var(--q-x) + var(--dxb)), calc(var(--q-y) + var(--dyb))) scale(var(--sb)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
}

@keyframes xxx-balloon {
  from {
    opacity: var(--oa);
    transform: translate(calc(var(--q-x) + var(--dxa)), calc(var(--q-y) + var(--dya))) scale(var(--sa)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--ob);
    transform: translate(calc(var(--q-x) + var(--dxb)), calc(var(--q-y) + var(--dyb))) scale(var(--sb)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
  }
}
`
  }
}
*/
