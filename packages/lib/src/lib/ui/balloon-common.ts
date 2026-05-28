/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useEffect, type RefObject } from 'react'

import { type HV, type Size } from '../../types'
import { boxBox, type BoxBox } from '../box/prefixed'
import { timing_closing, timing_opening, ZOOM_DURATION_DETAIL } from '../css'
import { ab } from '../utils'
import {
  vecVec as v,
  vecAdd as add,
  vecScale as scale,
  vecMul as mul,
  vecSub as sub,
  type VecVec as V,
  vecZero,
  vecAdd,
} from '../vec/prefixed'
import { type BalloonProps } from './Balloon'
import { diag } from './diag'
import { openCloseIsVisible } from './openclose'
import { useOpenCloseDetail } from './ui-react'
import { type UiDetailContent } from './ui-types'

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
  detail: Readonly<UiDetailContent>
): BalloonProps {
  const _p = detail.p
  const layout = detail.layout

  const _hv = diag(detail.layout.container, _p)

  const _W = layout.container.width
  const _H = layout.container.height

  const _size = calcBalloonSize(_W, _H)

  const _leg = layoutLeg(_hv, _size.bw, _size.bh, _size.lh)

  return { _p, _hv, _W, _H, _size, _leg }
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

function balloonPath(
  hv: Readonly<HV>,
  bw: number,
  bh: number,
  lh: number
): BalloonPath {
  const hb = v(bw / 2, bh / 2)

  const body = `
m${-hb.x},${-hb.y}
h${bw}
v${bh}
h${-bw}
z
`

  const { p, q, a, b } = layoutLeg(hv, bw, bh, lh)
  const aq = sub(q, a)
  const qb = sub(b, q)
  const bp = sub(p, b)
  const leg = `
m${a.x},${a.y}
l${aq.x},${aq.y}
l${qb.x},${qb.y}
l${bp.x},${bp.y}
z
`

  return { body, leg }
}

export function balloonPaths(
  hv: Readonly<HV>,
  size: Readonly<BalloonSize>
): BalloonPaths {
  const { bw, bh, lh, d, width, height } = size

  const viewBox = boxBox(-width / 2, -width / 2, width, height)

  const { body, leg } = balloonPath(hv, bw, bh, lh)

  function dToShape(d: number): string {
    return `M${d},${d} ${body} M${d},${d} ${leg}`
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
  }
  &.detail {
    animation: xxx-detail var(--duration) var(--timing);
  }
  &.balloon {
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
    opacity: var(--a);
    transform: translate(var(--tx-a-x), var(--tx-a-y)) scale(var(--a)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--b);
    transform: translate(var(--tx-b-x), var(--tx-b-y)) scale(var(--b)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
}

@keyframes xxx-balloon {
  from {
    opacity: var(--a);
    transform: translate(var(--tx-a-x), var(--tx-a-y)) scale(var(--a)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--b);
    transform: translate(var(--tx-b-x), var(--tx-b-y)) scale(var(--b)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
  }
}
`

export function useDetailStyle(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  Q: null | V,
  _hv: null | Readonly<HV>,
  size: Readonly<BalloonSize>,
  leg: Readonly<LegLayout>
): void {
  const { open, animating } = useOpenCloseDetail()

  useEffect(() => {
    if (ref.current === null) return
    const e = ref.current
    const x = (k: string, v: null | number | string) =>
      e.style.setProperty(k, v === null ? null : String(v))
    if (
      Q === null ||
      _hv === null ||
      !openCloseIsVisible({ open, animating })
    ) {
      x('visibility', 'hidden')
      return
    }
    const { width, height } = size
    const dP = scale(leg.q, -1)
    x('visibility', null)
    x('--pww', `${-width / 2}px`)
    x('--phh', `${-height / 2}px`)
    if (!animating) {
      const { b } = ab(0, 1)
      const tx = vecAdd(Q, dP)

      x('--a', null)
      x('--b', b)
      x('--timing', null)
      x('--tx-a-x', null)
      x('--tx-a-y', null)
      x('--tx-b-x', `${tx.x}px`)
      x('--tx-b-y', `${tx.y}px`)
      return
    } else {
      const { a, b } = open ? ab(0, 1) : ab(1, 0)
      const t = open ? timing_opening : timing_closing
      const d = open ? ab(vecZero, dP) : ab(dP, vecZero)
      const tx = ab(vecAdd(Q, d.a), vecAdd(Q, d.b))

      x('--a', a)
      x('--b', b)
      x('--timing', `${t}`)
      x('--tx-a-x', `${tx.a.x}px`)
      x('--tx-a-y', `${tx.a.y}px`)
      x('--tx-b-x', `${tx.b.x}px`)
      x('--tx-b-y', `${tx.b.y}px`)
      return
    }
  }, [Q, _hv, animating, leg.q, open, ref, size])
}
