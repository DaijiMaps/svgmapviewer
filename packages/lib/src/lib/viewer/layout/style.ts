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
  animation: Readonly<null | AnimationMatrix>,
  zoom: number
): void {
  const a = animation?.from ?? null
  const b = animation?.to ?? null
  const zp = animation?.from.a ?? null
  const zq = animation?.to.a ?? null
  const o =
    animation === null || animation.origin === null
      ? `left top`
      : `${animation.origin.x}px ${animation?.origin.y}px`
  Array.from(zoomStyleRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    tag(e, 'zooming', animation !== null)
    s(`--zoom-zoom`, zoom.toString())
    s(`--zoom-origin`, o)
    s(`--zoom-matrix-tx-a`, a === null ? null : `${a.e}px`)
    s(`--zoom-matrix-tx-b`, b === null ? null : `${b.e}px`)
    s(`--zoom-matrix-ty-a`, a === null ? null : `${a.f}px`)
    s(`--zoom-matrix-ty-b`, b === null ? null : `${b.f}px`)
    s(`--zoom-matrix-s-a`, a === null ? null : `${a.a}`)
    s(`--zoom-matrix-s-b`, b === null ? null : `${b.a}`)
    s(`--zoom-z-a`, zp === null ? null : zp.toString())
    s(`--zoom-z-b`, zq === null ? null : zq.toString())
    s(`--zoom-z-inv-a`, zp === null ? null : (1 / zp).toString())
    s(`--zoom-z-inv-b`, zq === null ? null : (1 / zq).toString())
  })
  /*
  if (animation !== null)
    startLoop('zoom', 500, {
      tickcb: () => {},
      donecb: () => console.log('loop done!'),
    })
  */
}

// --zoom-matrix-t = <transform-function>
// --zoom-z-t = <number>
// --zoom = <number>
