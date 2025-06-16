import { boxBox, type BoxBox } from './box/prefixed'
import { timing_closing, timing_opening, ZOOM_DURATION_DETAIL } from './css'
import type { OpenClose } from './openclose'
import type { Dir, Size } from './types'
import type { VecVec } from './vec/prefixed'

export interface BalloonPathProps {
  dir: Dir
  bw: number
  bh: number
  ll: number
}

export interface BalloonSize extends Size {
  bw: number
  bh: number
  ll: number
  d: number
}

interface BalloonPath {
  body: string
  leg: string
}

function balloonPath({
  dir,
  ll,
  bw,
  bh,
}: Readonly<BalloonPathProps>): BalloonPath {
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

  return { body, leg }
}

export function calcBalloonSize(_W: number, _H: number): BalloonSize {
  // XXX
  const vmin = Math.min(_W, _H) * 0.01

  const bw = vmin * BW // body width
  const bh = vmin * BH // body height
  const ll = vmin * BL // leg length

  const d = bw / 100 // shadow

  const width = bw + 2 * ll + 2 * d
  const height = bh + 2 * ll + 2 * d

  return { width, height, bw, bh, ll, d }
}

export interface BalloonProps {
  _dir: Dir
  _W: number
  _H: number
}

const BW = 50
const BH = 50
const BL = 10

export interface BalloonPaths {
  viewBox: Readonly<BoxBox>
  width: number
  height: number
  fg: string
  bg: string
}

export function balloonPaths({
  _dir,
  _W,
  _H,
}: Readonly<BalloonProps>): BalloonPaths {
  const { bw, bh, ll, d, width, height } = calcBalloonSize(_W, _H)

  const viewBox = boxBox(-width / 2, -width / 2, width, height)

  const p = { bw, bh, ll }

  const { body, leg } = balloonPath({ dir: _dir, ...p })

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
  width: number,
  height: number
): string {
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
