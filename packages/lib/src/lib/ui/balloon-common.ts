/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type HV, type Size } from '../../types'
import { boxBox, type BoxBox } from '../box/prefixed'
import { timing_closing, timing_opening, ZOOM_DURATION_DETAIL } from '../css'
import { ab, trunc3, type AB } from '../utils'
import {
  vecVec as v,
  vecAdd as add,
  vecScale as scale,
  vecMul as mul,
  vecSub as sub,
  type VecVec as V,
  vecZero,
  vecAdd,
  type VecVec,
} from '../vec/prefixed'
import type { LayoutCoord } from '../viewer/layout/layout'
import { diag } from './diag'
import { openCloseIsVisible, type OpenClose } from './openclose'

export interface BalloonProps {
  _p: null | VecVec
  _hv: null | HV
  _W: number
  _H: number
  _size: BalloonSize
  _leg: LegLayout
}

const BW = 50
const BH = 50
const BL = 10

interface BalloonPath {
  body: string
  leg: string
}

export interface BalloonSize extends Size {
  bw: number
  bh: number
  lh: number
  d: number
}

export interface BalloonPaths {
  viewBox: Readonly<BoxBox>
  width: number
  height: number
  fg: string
  bg: string
}

export interface LegLayout {
  p: V
  q: V
  a: V
  b: V
}

////

export function calcBalloonLayout(
  layout: Readonly<LayoutCoord>,
  p: VecVec
): BalloonProps {
  const _hv = diag(layout.container, p)

  const _W = layout.container.width
  const _H = layout.container.height

  const _size = calcBalloonSize(_W, _H)

  const _leg = layoutLeg(_hv, _size.bw, _size.bh, _size.lh)

  return { _p: p, _hv, _W, _H, _size, _leg }
}

export function calcBalloonSize(_W: number, _H: number): BalloonSize {
  // XXX
  const vmin = Math.min(_W, _H) * 0.01

  const bw = vmin * BW // body width
  const bh = vmin * BH // body height
  const lh = vmin * BL // leg height

  const d = bw / 100 // shadow

  const width = bw + 2 * lh + 2 * d
  const height = bh + 2 * lh + 2 * d

  return { bw, bh, lh, d, width, height }
}

export function layoutLeg(
  hv: Readonly<HV>,
  bw: number,
  bh: number,
  lh: number
): {
  p: V
  q: V
  a: V
  b: V
} {
  const hb = v(bw / 2, bh / 2)

  const lw = bw / 20
  const hlw = lw / 2

  function flip(a: V): V {
    return mul(a, v(hv.h, hv.v))
  }

  const landscape = hv.th < Math.PI / 4
  const horizontal = hv.v === 0
  const vertical = hv.h === 0
  const angled = !(horizontal || vertical)

  const p = flip(scale(hb, -1))

  const dq = v(
    landscape ? lh : 0, // lh * Math.cos(hv.th)
    landscape ? 0 : lh // lh * Math.sin(hv.th)
  )
  const q = flip(
    !angled ? sub(scale(hb, -1), v(lh, lh)) : sub(scale(hb, -1), dq)
  )

  const [da, db]: [V, V] = vertical
    ? [v(-hlw, 0), v(hlw, 0)] // vertical leg
    : horizontal
      ? [v(0, -hlw), v(0, hlw)] // horizontal leg
      : landscape
        ? [v(0, 0), flip(v(0, lw))] // angled (landscape)
        : [v(0, 0), flip(v(lw, 0))] // angled (portrait)
  const a = add(p, da)
  const b = add(p, db)

  return { p, q, a, b }
}

const xy3 = ({ x, y }: V) => `${trunc3(x)}, ${trunc3(y)}`

function balloonPath(
  hv: Readonly<HV>,
  bw: number,
  bh: number,
  lh: number
): BalloonPath {
  const hb = v(bw / 2, bh / 2)

  const body = `
m${trunc3(-hb.x)},${trunc3(-hb.y)}
h${trunc3(bw)}
v${trunc3(bh)}
h${trunc3(-bw)}
z
`

  const { p, q, a, b } = layoutLeg(hv, bw, bh, lh)
  const aq = sub(q, a)
  const qb = sub(b, q)
  const bp = sub(p, b)
  const leg = `
m${xy3(a)}
l${xy3(aq)}
l${xy3(qb)}
l${xy3(bp)}
z
`

  return { body, leg }
}

export function calcBalloonPaths(
  hv: Readonly<HV>,
  size: Readonly<BalloonSize>
): BalloonPaths {
  const { bw, bh, lh, d, width, height } = size

  const viewBox = boxBox(-width / 2, -width / 2, width, height)

  const { body, leg } = balloonPath(hv, bw, bh, lh)

  function dToShape(d: number): string {
    return `M${trunc3(d)},${trunc3(d)} ${body} M${trunc3(d)},${trunc3(d)} ${leg}`
  }
  const bg = dToShape(d)
  const fg = dToShape(0)

  return {
    viewBox,
    width,
    height,
    bg,
    fg,
  }
}

export const detailStyleString: string = `
.not-animating {
  &.detail {
    transform-origin: 0 0;
    transform: translate(var(--tx-b-x), var(--tx-b-y)) scale(var(--b)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
  &.balloon {
    transform-origin: 0 0;
    transform: translate(var(--tx-b-x), var(--tx-b-y)) scale(var(--b)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
  }
}

.animating {
  &.detail,
  &.balloon {
    --duration: ${ZOOM_DURATION_DETAIL}ms;
    transform-origin: 0 0;
    will-change: opacity, transform;
    opacity: var(--opacity);
  }
  &.detail {
    transform: translate(var(--balloon-translate-x), var(--balloon-translate-y)) scale(var(--balloon-scale)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
    animation: xxx-detail var(--duration) var(--timing);
  }
  &.balloon {
    transform: translate(var(--balloon-translate-x), var(--balloon-translate-y)) scale(var(--balloon-scale)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
    animation: xxx-balloon var(--duration) var(--timing);
  }
  &.closed {
    --timing: ${timing_closing};
  }
  &.opened {
    --timing: ${timing_opening};
  }
}

@keyframes xxx-detail {
  from {
    --opacity: var(--a);
    --balloon-translate-x: var(--tx-a-x);
    --balloon-translate-y: var(--tx-a-y);
    --balloon-scale: var(--a);
    /*
    transform: translate(var(--tx-a-x), var(--tx-a-y)) scale(var(--a)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
    */
  }
  to {
    --opacity: var(--b);
    --balloon-translate-x: var(--tx-b-x);
    --balloon-translate-y: var(--tx-b-y);
    --balloon-scale: var(--b);
    /*
    transform: translate(var(--tx-b-x), var(--tx-b-y)) scale(var(--b)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
    */
  }
}

@keyframes xxx-balloon {
  from {
    --opacity: var(--a);
    --balloon-translate-x: var(--tx-a-x);
    --balloon-translate-y: var(--tx-a-y);
    --balloon-scale: var(--a);
    /*
    transform: translate(var(--tx-a-x), var(--tx-a-y)) scale(var(--a)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
    */
  }
  to {
    --opacity: var(--b);
    --balloon-translate-x: var(--tx-b-x);
    --balloon-translate-y: var(--tx-b-y);
    --balloon-scale: var(--b);
    /*
    transform: translate(var(--tx-b-x), var(--tx-b-y)) scale(var(--b)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
    */
  }
}
`

type BalloonStyle = {
  a: 0 | 1 | null
  b: 0 | 1 | null
  timing: string | null
  txa: V | null
  txb: V | null
}

function calcStyle(
  open: boolean,
  animating: boolean,
  Q: V,
  q: V
): BalloonStyle {
  const dP = scale(q, -1)
  if (!animating) {
    const a = null
    const { b }: AB<0 | 1> = ab(0, 1)
    const timing = null
    const txa = null
    const txb = vecAdd(Q, dP)
    return { a, b, timing, txa, txb }
  } else {
    const { a, b }: AB<0 | 1> = open ? ab(0, 1) : ab(1, 0)
    const timing = open ? timing_opening : timing_closing
    const d = open ? ab(vecZero, dP) : ab(dP, vecZero)
    const { a: txa, b: txb } = ab(vecAdd(Q, d.a), vecAdd(Q, d.b))
    return { a, b, timing, txa, txb }
  }
}

type BalloonStyleParams = Readonly<{
  readonly visibility: string | null
  readonly pww: string | null
  readonly phh: string | null
  readonly a: 0 | 1 | null
  readonly b: 0 | 1 | null
  readonly timing: string | null
  readonly txax: string | null
  readonly txay: string | null
  readonly txbx: string | null
  readonly txby: string | null
}>

export function calcBalloonStyleParams(
  Q: null | V,
  _hv: null | Readonly<HV>,
  size: Readonly<BalloonSize>,
  leg: Readonly<LegLayout>,
  { open, animating }: OpenClose
): BalloonStyleParams {
  if (Q === null || _hv === null || !openCloseIsVisible({ open, animating })) {
    const visibility = 'hidden'
    const pww = null
    const phh = null
    const a = null
    const b = null
    const timing = null
    const txax = null
    const txay = null
    const txbx = null
    const txby = null
    return { visibility, a, b, timing, pww, phh, txax, txay, txbx, txby }
  } else {
    const { width, height } = size
    const { a, b, timing, txa, txb } = calcStyle(open, animating, Q, leg.q)
    const visibility = null
    const pww = `${trunc3(-width / 2)}px`
    const phh = `${trunc3(-height / 2)}px`
    const txax = txa && `${trunc3(txa.x)}px`
    const txay = txa && `${trunc3(txa.y)}px`
    const txbx = txb && `${trunc3(txb.x)}px`
    const txby = txb && `${trunc3(txb.y)}px`
    return { visibility, a, b, timing, pww, phh, txax, txay, txbx, txby }
  }
}

export function updateBalloonStyle(
  e: Readonly<HTMLDivElement>,
  {
    visibility,
    a,
    b,
    timing,
    pww,
    phh,
    txax,
    txay,
    txbx,
    txby,
  }: BalloonStyleParams
): void {
  const p = e.style.setProperty.bind(e.style)
  p('visibility', visibility)
  p('--pww', pww)
  p('--phh', phh)
  p('--a', a === null ? null : a.toString())
  p('--b', b === null ? null : b.toString())
  p('--timing', timing)
  p('--tx-a-x', txax)
  p('--tx-a-y', txay)
  p('--tx-b-x', txbx)
  p('--tx-b-y', txby)
}
