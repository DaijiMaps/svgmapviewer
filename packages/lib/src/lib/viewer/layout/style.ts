/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

import type { AnimationMatrix } from '../../../types'
import { notifyStyle } from '../../event-style'
import { startLoop } from '../../style/frame'
import { useStyleRef } from '../../style/ref'
import { tag } from '../../style/tag'
import { easeCubic, lerp } from '../../style/timing'
import { trunc2 } from '../../utils'
import { viewerSend } from '../viewer-xstate'
import { fromSvgToContent } from './coord'
import type { Layout } from './layout-types'

const layoutStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useLayoutStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(layoutStyleRefs, ref, name)
}

function matrixTrunc2(m: DOMMatrixReadOnly): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly([m.a, m.b, m.c, m.d, trunc2(m.e), trunc2(m.f)])
}

export function updateLayoutStyleRefs(layout: Readonly<Layout>): void {
  const svgToContent = fromSvgToContent(layout)
  Array.from(layoutStyleRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    s(`--layout-content-matrix`, layout.content.toString())
    s(`--layout-scroll-width`, `${trunc2(layout.scroll.width)}px`)
    s(`--layout-scroll-height`, `${trunc2(layout.scroll.height)}px`)
    s(`--layout-svg-to-content-matrix`, matrixTrunc2(svgToContent).toString())
  })
}

////

const zoomStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useZoomStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(zoomStyleRefs, ref, name)
}

export function updateZoomStyleRefs(
  animation: Readonly<null | AnimationMatrix>
  //zoom: number
): void {
  /*
  const a = animation?.from ?? null
  const b = animation?.to ?? null
  const za = a?.a ?? null
  const zb = b?.a ?? null
  */
  const o =
    animation === null || animation.origin === null
      ? `left top`
      : `${animation.origin.x}px ${animation?.origin.y}px`
  Array.from(zoomStyleRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    tag(e, 'zooming', animation !== null)
    s(`--zoom-origin`, o)
    /*
    s(`--zoom-zoom`, zoom.toString())
    s(`--zoom-tx-a`, a === null ? null : `${a.e}px`)
    s(`--zoom-tx-b`, b === null ? null : `${b.e}px`)
    s(`--zoom-ty-a`, a === null ? null : `${a.f}px`)
    s(`--zoom-ty-b`, b === null ? null : `${b.f}px`)
    s(`--zoom-s-a`, za === null ? null : za.toString())
    s(`--zoom-s-b`, zb === null ? null : zb.toString())
    s(`--zoom-z-a`, za === null ? null : za.toString())
    s(`--zoom-z-b`, zb === null ? null : zb.toString())
    s(`--zoom-z-inv-a`, za === null ? null : (1 / za).toString())
    s(`--zoom-z-inv-b`, zb === null ? null : (1 / zb).toString())
    */
  })
  if (animation !== null)
    startLoop('zoom', 500, {
      tickcb: tickZoomStyleRefs,
      donecb: () => {
        viewerSend({ type: 'ANIMATION.END' })
        notifyStyle.animationEnd()
      },
      cbdata: animation,
    })
}

type Values = Readonly<{
  readonly tx: number
  readonly ty: number
  readonly s: number
  readonly sinv: number
}>

export function getCurrentValues(
  animation: Readonly<AnimationMatrix>,
  t: number
): Values {
  const a = animation.from
  const b = animation.to
  const tx = lerp(a.e, b.e, easeCubic(t))
  const ty = lerp(a.f, b.f, easeCubic(t))
  const s = lerp(a.a, b.a, easeCubic(t))
  return { tx, ty, s, sinv: 1 / s }
}

export function tickZoomStyleRefs(
  t: number,
  animation?: Readonly<AnimationMatrix>
): void {
  if (!animation) return
  const values = getCurrentValues(animation, t)
  Array.from(zoomStyleRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    s(`--zoom-tx`, `${values.tx}px`)
    s(`--zoom-ty`, `${values.ty}px`)
    s(`--zoom-s`, `${values.s}`)
    s(`--zoom-sinv`, `${1 / values.s}`)
  })
}
