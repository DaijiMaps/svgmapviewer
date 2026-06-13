/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

import type { AnimationMatrix } from '../../../types'
import { useStyleRef } from '../../style/ref'
import { tag } from '../../style/tag'
import { trunc2 } from '../../utils'
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
  a: Readonly<null | AnimationMatrix>,
  zoom: number
): void {
  const p = a?.from.toString() ?? null
  const q = a?.to.toString() ?? null
  const zp = a?.from.a ?? null
  const zq = a?.to.a ?? null
  const o =
    a === null || a.origin === null
      ? `left top`
      : `${a.origin.x}px ${a?.origin.y}px`
  Array.from(zoomStyleRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    tag(e, 'zooming', a !== null)
    s(`--zoom-zoom`, zoom.toString())
    s(`--zoom-origin`, o)
    s(`--zoom-p`, p === null ? null : `${p} translate3d(0px, 0px, 0px)`)
    s(`--zoom-q`, q === null ? null : `${q} translate3d(0px, 0px, 0px)`)
    s(`--zoom-zp`, zp === null ? null : zp.toString())
    s(`--zoom-zq`, zq === null ? null : zq.toString())
    s(`--zoom-zp-inv`, zp === null ? null : (1 / zp).toString())
    s(`--zoom-zq-inv`, zq === null ? null : (1 / zq).toString())
  })
}
