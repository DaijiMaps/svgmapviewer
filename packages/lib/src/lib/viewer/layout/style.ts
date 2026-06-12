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

const animationStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useAnimationStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(animationStyleRefs, ref, name)
}

export function updateAnimationStyleRefs(
  a: Readonly<null | AnimationMatrix>
): void {
  const p = a?.from.toString()
  const q = a?.to.toString()
  const o =
    a?.origin === null ? `left top` : `${a?.origin.x}px ${a?.origin.y}px`
  Array.from(animationStyleRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    tag(e, 'zooming', a !== null)
    if (a === null) return
    s(`--zoom-origin-p`, o)
    s(`--zoom-origin-q`, o)
    s(`--zoom-p`, `${p} translate3d(0px, 0px, 0px)`)
    s(`--zoom-q`, `${q} translate3d(0px, 0px, 0px)`)
  })
}
