import type { BalloonProps } from '../Balloon'
import { boxBox, type BoxBox } from './box/prefixed'
import { timing_closing, timing_opening, ZOOM_DURATION_DETAIL } from './css'
import { diag2 } from './diag'
import type { OpenClose } from './openclose'
import type { HV, Size } from './types'
import type { UiDetailContent } from './ui-types'
import { vecAdd, vecVec, type VecVec } from './vec/prefixed'

const BW = 50
const BH = 50
const BL = 10

interface BalloonPath {
  body: string
  leg: string
}

interface BalloonSize extends Size {
  bw: number
  bh: number
  ll: number
  d: number
}

export interface BalloonPaths {
  viewBox: Readonly<BoxBox>
  width: number
  height: number
  fg: string
  bg: string
}

////

export function calcBalloonLayout(
  detail: Readonly<UiDetailContent>
): BalloonProps {
  const _p = detail.p
  const layout = detail.layout

  const _hv = diag2(detail.layout.container, _p)

  const _W = layout.container.width
  const _H = layout.container.height

  return { _p, _hv, _W, _H }
}

function calcBalloonSize(_W: number, _H: number): BalloonSize {
  // XXX
  const vmin = Math.min(_W, _H) * 0.01

  const bw = vmin * BW // body width
  const bh = vmin * BH // body height
  const ll = vmin * BL // leg length

  const d = bw / 100 // shadow

  const width = bw + 2 * ll + 2 * d
  const height = bh + 2 * ll + 2 * d

  return { bw, bh, ll, d, width, height }
}

export function layoutLeg(
  hv: Readonly<HV>,
  bw: number,
  bh: number,
  ll: number
): {
  p: VecVec
  q: VecVec
  a: VecVec
  b: VecVec
} {
  const hbw = bw / 2
  const hbh = bh / 2

  const lw = bw / 20
  const hlw = lw / 2

  const p = vecVec(-hbw * hv.h, -hbh * hv.v)
  const q = vecVec(-(hbw + ll) * hv.h, -(hbh + ll) * hv.v)

  const da =
    hv.h === 0
      ? vecVec(-hlw, 0)
      : hv.v === 0
        ? vecVec(0, -hlw)
        : vecVec(hlw * hv.h, 0)
  const db =
    hv.h === 0
      ? vecVec(hlw, 0)
      : hv.v === 0
        ? vecVec(0, hlw)
        : vecVec(0, hlw * hv.v)
  const a = vecAdd(p, da)
  const b = vecAdd(p, db)

  return { p, q, a, b }
}

function balloonPath(
  hv: Readonly<HV>,
  bw: number,
  bh: number,
  ll: number
): BalloonPath {
  const hbw = bw / 2
  const hbh = bh / 2

  const body = `
m${-hbw},${-hbh}
h${bw}
v${bh}
h${-bw}
z
`
  const { p, q, a, b } = layoutLeg(hv, bw, bh, ll)

  const leg = `
m${a.x},${a.y}
l${q.x - a.x},${q.y - a.y}
l${b.x - q.x},${b.y - q.y}
l${p.x - b.x},${p.y - b.y}
z
`

  return { body, leg }
}

export function balloonPaths(
  _hv: Readonly<HV>,
  _W: number,
  _H: number
): BalloonPaths {
  const { bw, bh, ll, d, width, height } = calcBalloonSize(_W, _H)

  const viewBox = boxBox(-width / 2, -width / 2, width, height)

  const { body, leg } = balloonPath(_hv, bw, bh, ll)

  const fg = `M0,0` + body + `M0,0` + leg
  const bg = `M${d},${d}` + body + `M${d},${d}` + leg

  return {
    viewBox,
    width,
    height,
    bg,
    fg,
  }
}

export function balloonStyle(
  { open, animating }: OpenClose,
  Q: VecVec,
  hv: Readonly<HV>,
  W: number,
  H: number
): string {
  const { width, height } = calcBalloonSize(W, H)

  const dP = vecVec((width / 2) * hv.h, (height / 2) * hv.v)

  if (!animating) {
    const sb = 1
    const dxb = 'var(--dp-x)'
    const dyb = 'var(--dp-y)'

    return `
.detail,
.balloon {
  --q-x: ${Q.x}px;
  --q-y: ${Q.y}px;
  --sb: ${sb};
  --dp-x: ${dP.x}px;
  --dp-y: ${dP.y}px;
  --dxb: ${dxb};
  --dyb: ${dyb};
  --pww: ${-width / 2}px;
  --phh: ${-height / 2}px;
}

.detail {
  transform-origin: 0 0;
  transform: translate(calc(var(--q-x) + var(--dxb)), calc(var(--q-y) + var(--dyb))) scale(var(--sb)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
}

.balloon {
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
.balloon {
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
  --pww: ${-width / 2}px;
  --phh: ${-height / 2}px;
  --duration: ${ZOOM_DURATION_DETAIL}ms;
  transform-origin: 0 0;
  will-change: opacity, transform;
}

.detail {
  animation: xxx-detail var(--duration) var(--timing);
}

.balloon {
  animation: xxx-balloon var(--duration) var(--timing);
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
