/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

//import { notifyStyle } from '../../event-style'
//import { startLoop } from '../../style/frame'
import { useStyleRef } from '../../style/ref'
import { trunc2 } from '../../utils'
//import { viewerSend } from '../viewer-xstate'
import { fromSvgToContent } from './coord'
import type { Layout } from './layout-types'

const layoutStyleRefs: Map<string, HTMLElement | SVGElement> = new Map()
const svgStyleRefs: Map<string, HTMLElement | SVGElement> = new Map()
const svgScaleStyleRefs: Map<string, HTMLElement | SVGElement> = new Map()

export function useLayoutStyleRef(
  ref: Readonly<RefObject<HTMLElement | SVGElement | null>>,
  name: string
): void {
  useStyleRef(layoutStyleRefs, ref, name)
}
export function useSvgStyleRef(
  ref: Readonly<RefObject<HTMLElement | SVGElement | null>>,
  name: string
): void {
  useStyleRef(svgStyleRefs, ref, name)
}
export function useSvgScaleStyleRef(
  ref: Readonly<RefObject<HTMLElement | SVGElement | null>>,
  name: string
): void {
  useStyleRef(svgScaleStyleRefs, ref, name)
}

function matrixTrunc2(m: DOMMatrixReadOnly): DOMMatrixReadOnly {
  return new DOMMatrixReadOnly([m.a, m.b, m.c, m.d, trunc2(m.e), trunc2(m.f)])
}

export function updateLayoutStyleRefs(layout: Readonly<Layout>): void {
  const svgToContent = fromSvgToContent(layout)
  Array.from(layoutStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    //p(`--layout-container-width`, `${trunc2(layout.container.width)}px`)
    //p(`--layout-container-height`, `${trunc2(layout.container.height)}px`)
    p(`--layout-content-matrix`, layout.content.toString())
    p(`--layout-scroll-width`, `${trunc2(layout.scroll.width)}px`)
    p(`--layout-scroll-height`, `${trunc2(layout.scroll.height)}px`)
    p(`--layout-svg-to-content-matrix`, matrixTrunc2(svgToContent).toString())
  })
  Array.from(svgStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--layout-svg-x`, `${trunc2(layout.svg.x).toString()}px`)
    p(`--layout-svg-y`, `${trunc2(layout.svg.y).toString()}px`)
    p(`--layout-svg-width`, `${trunc2(layout.svg.width).toString()}px`)
    p(`--layout-svg-height`, `${trunc2(layout.svg.height).toString()}px`)
  })
}

export function updateSvgScaleStyleRefs(layout: Readonly<Layout>): void {
  Array.from(svgScaleStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--layout-svgscale`, `${trunc2(layout.svgScale)}`)
    p(`--layout-fontsize`, `${trunc2(layout.config.fontSize)}`)
  })
}
