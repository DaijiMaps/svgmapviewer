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
  animation: Readonly<null | AnimationMatrix>,
  zoom: number
): void {
  const o =
    animation === null || animation.origin === null
      ? `left top`
      : `${animation.origin.x}px ${animation?.origin.y}px`
  Array.from(zoomStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    tag(e, 'zooming', animation !== null)
    p(`--zoom-origin`, o)
    p(`--zoom-zoom`, zoom.toString())
  })
  if (animation !== null)
    startLoop('zoom', 500, {
      tickcb: tickZoomStyleRefs,
      donecb: () => {
        viewerSend({ type: 'ANIMATION.END' })
        notifyStyle.animationEnd()
      },
      cbdata: { animation, zoom },
    })
}

type ZoomData = Readonly<{
  animation: Readonly<AnimationMatrix>
  zoom: number
}>

type ZoomValues = Readonly<{
  readonly tx: number
  readonly ty: number
  readonly s: number
  readonly sinv: number
  readonly z: number
  readonly zinv: number
}>

function getCurrentZoomValues(
  { animation, zoom }: ZoomData,
  t: number
): ZoomValues {
  const a = animation.from
  const b = animation.to
  const tx = lerp(a.e, b.e, easeCubic(t))
  const ty = lerp(a.f, b.f, easeCubic(t))
  const s = lerp(a.a, b.a, easeCubic(t))
  const za = zoom
  const zb = zoom * s
  const z = lerp(za, zb, easeCubic(t))
  return { tx, ty, s, sinv: 1 / s, z, zinv: 1 / z }
}

function tickZoomStyleRefs(t: number, cbdata?: ZoomData): void {
  if (!cbdata) return
  const { tx, ty, s, sinv, z, zinv } = getCurrentZoomValues(cbdata, t)
  Array.from(zoomStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--zoom-tx`, `${tx}px`)
    p(`--zoom-ty`, `${ty}px`)
    p(`--zoom-s`, `${s}`)
    p(`--zoom-s-inv`, `${sinv}`)
    p(`--zoom-z`, `${z}`)
    p(`--zoom-z-inv`, `${zinv}`)
  })
}
