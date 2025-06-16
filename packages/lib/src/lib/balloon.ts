import { boxBox, type BoxBox } from './box/prefixed'
import { timing_closing, timing_opening, ZOOM_DURATION_DETAIL } from './css'
import type { OpenClose } from './openclose'
import type { Dir, Size } from './types'
import type { VecVec } from './vec/prefixed'

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

function balloonPath(
  dir: Dir,
  bw: number,
  bh: number,
  ll: number
): BalloonPath {
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
  const virtical = dir === 0 || dir === 2
  const inv = dir === 1 || dir === 3 ? -1 : 1
  const leg = virtical
    ? `
m${-hlw},${-hbh * inv}
l${hlw},${-ll * inv}
l${hlw},${ll * inv}
z
`
    : `
m${-hbw * inv},${-hlw}
l${-ll * inv},${hlw}
l${ll * inv},${hlw}
z
`

  return { body, leg }
}

export function balloonPaths(_dir: Dir, _W: number, _H: number): BalloonPaths {
  const { bw, bh, ll, d, width, height } = calcBalloonSize(_W, _H)

  const viewBox = boxBox(-width / 2, -width / 2, width, height)

  const { body, leg } = balloonPath(_dir, bw, bh, ll)

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
  dir: Dir,
  W: number,
  H: number
): string {
  const { width, height } = calcBalloonSize(W, H)

  const dPs = [
    { x: 0, y: height / 2 },
    { x: -width / 2, y: 0 },
    { x: 0, y: -height / 2 },
    { x: width / 2, y: 0 },
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
  --pww: ${-width / 2}px;
  --phh: ${-height / 2}px;
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
  --pww: ${-width / 2}px;
  --phh: ${-height / 2}px;
  --duration: ${ZOOM_DURATION_DETAIL}ms;
  transform-origin: 0 0;
  will-change: opacity, transform;
}

.detail {
  animation: xxx-detail var(--duration) var(--timing);
}

.balloon-container {
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
