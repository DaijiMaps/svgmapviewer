/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

import type { AnimationMatrix } from '../../../types'
import { ZOOM_DURATION_CONTAINER } from '../../css'
//import { notifyStyle } from '../../event-style'
//import { startLoop } from '../../style/frame'
import { useStyleRef } from '../../style/ref'
import { tag } from '../../style/tag'
import { easeCubic, lerp } from '../../style/timing'
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

////

const zoomStyleRefs: Map<string, HTMLElement | SVGElement> = new Map()
const zoomSStyleRefs: Map<string, HTMLElement | SVGElement> = new Map()
const zoomCondStyleRefs: Map<string, HTMLElement | SVGElement> = new Map()

export function useZoomStyleRef(
  ref: Readonly<RefObject<HTMLElement | SVGElement | null>>,
  name: string
): void {
  useStyleRef(zoomStyleRefs, ref, name)
}
export function useZoomSStyleRef(
  ref: Readonly<RefObject<HTMLElement | SVGElement | null>>,
  name: string
): void {
  useStyleRef(zoomSStyleRefs, ref, name)
}
export function useZoomCondStyleRef(
  ref: Readonly<RefObject<HTMLElement | SVGElement | null>>,
  name: string
): void {
  useStyleRef(zoomCondStyleRefs, ref, name)
}

const zoomAnimation = `container-zoom ${ZOOM_DURATION_CONTAINER}ms ease`
const rotateAnimation = `container-rotate ${ZOOM_DURATION_CONTAINER}ms ease`

export function updateZoomStyleRefs(
  animation: Readonly<null | AnimationMatrix>,
  zoom: number
): void {
  const o =
    animation === null || animation.origin === null
      ? `0% 0%`
      : `${animation.origin.x}px ${animation?.origin.y}px`
  const rotating = animation?.to.b !== 0
  const za =
    rotating || animation === null
      ? null
      : getCurrentZoomValues({ animation, zoom }, 0)
  const zb =
    rotating || animation === null
      ? null
      : getCurrentZoomValues({ animation, zoom }, 1)
  const ra =
    !rotating || animation === null
      ? null
      : getCurrentRotateValues({ animation, zoom }, 0)
  const rb =
    !rotating || animation === null
      ? null
      : getCurrentRotateValues({ animation, zoom }, 1)
  const willChangeStyle = animation !== null ? `transform` : null
  const transformOriginStyle = animation !== null ? o : null
  const animationStyle =
    ra !== null ? rotateAnimation : za !== null ? zoomAnimation : null
  Array.from(zoomStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    //tag(e, 'zooming', animation !== null)
    //if (rotating) tag(e, 'rotating', animation !== null)
    p(`--zoom-origin`, o)
    p(`--zoom-zoom`, zoom.toString())
    p(`--zoom-s`, null)
    p(`--zoom-s-inv`, null)
    p(`--zoom-k`, null)
    p(`--zoom-k-inv`, null)
    p(`--zoom-tx-a`, (za && `${za.tx}px`) ?? null)
    p(`--zoom-ty-a`, (za && `${za.ty}px`) ?? null)
    p(`--zoom-tx-b`, (zb && `${zb.tx}px`) ?? null)
    p(`--zoom-ty-b`, (zb && `${zb.ty}px`) ?? null)
    p(`--zoom-s-a`, (za && `${za.s}`) ?? null)
    p(`--zoom-s-b`, (zb && `${zb.s}`) ?? null)
    p(`--rotate-deg-a`, (ra && `${ra.deg}deg`) ?? null)
    p(`--rotate-deg-b`, (rb && `${rb.deg}deg`) ?? null)
    p(`will-change`, willChangeStyle)
    p(`transform-origin`, transformOriginStyle)
    p(`animation`, animationStyle)
  })
  Array.from(zoomSStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--zoom-s`, animation === null ? null : animation.to.a.toString())
    p(`--zoom-s-symbols`, animation === null ? null : animation.to.a.toString())
    tag(e, 'zooming', animation !== null)
    if (rotating) tag(e, 'rotating', animation !== null)
  })
  Array.from(zoomCondStyleRefs, ([, e]) => {
    tag(e, 'zooming', animation !== null)
    if (rotating) tag(e, 'rotating', animation !== null)
  })
  /*
  if (animation !== null) {
    startLoop('zoom', 500, {
      tickcb: tickZoomStyleRefs,
      donecb: () => {
        viewerSend({ type: 'ANIMATION.END' })
        notifyStyle.animationEnd()
      },
      cbdata: { animation, zoom },
    })
    startLoop('zoomS', 500, {
      tickcb: tickZoomSStyleRefs,
      cbdata: { animation, zoom },
    })
  }
    */
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
  readonly k: number
  readonly kinv: number
}>

const getK = (zoom: number): number => 0.5 + 0.5 * Math.log2(Math.max(1, zoom))

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
  const ka = getK(zoom)
  const kb = getK(zoom * s)
  const k = lerp(ka, kb, easeCubic(t))
  return { tx, ty, s, sinv: 1 / s, z, zinv: 1 / z, k, kinv: 1 / k }
}

type RotateValues = Readonly<{
  readonly deg: number
  readonly deginv: number
}>

function getCurrentRotateValues(
  { animation }: ZoomData,
  t: number
): RotateValues {
  const a = getDeg(animation.from)
  const b = getDeg(animation.to)
  const deg = lerp(a, b, easeCubic(t))
  const deginv = 1 / deg
  return { deg, deginv }
}

/*
function tickZoomStyleRefs(t: number, cbdata?: ZoomData): void {
  if (!cbdata) return
  if (cbdata.animation.to.b === 0) {
    tickZoomZoomStyleRefs(t, cbdata)
  } else {
    tickZoomRotateStyleRefs(t, cbdata)
  }
}

function tickZoomZoomStyleRefs(t: number, cbdata: ZoomData): void {
  const { tx, ty, s, sinv, z, zinv, k, kinv } = getCurrentZoomValues(cbdata, t)
  Array.from(zoomStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--zoom-tx`, `${tx}px`)
    p(`--zoom-ty`, `${ty}px`)
    p(`--zoom-s`, `${s}`)
    p(`--zoom-s-inv`, `${sinv}`)
    p(`--zoom-z`, `${z}`)
    p(`--zoom-z-inv`, `${zinv}`)
    p(`--zoom-k`, `${k}`)
    p(`--zoom-k-inv`, `${kinv}`)
  })
}

function tickZoomRotateStyleRefs(t: number, cbdata: ZoomData): void {
  const { deg, deginv } = getCurrentRotateValues(cbdata, t)
  Array.from(zoomStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--zoom-deg`, `${deg}deg`)
    p(`--zoom-deg-inv`, `${deginv}deg`)
  })
}
*/

/*
function tickZoomSStyleRefs(t: number, cbdata?: ZoomData): void {
  if (!cbdata) return
  const { s } = getCurrentZoomValues(cbdata, t)
  Array.from(zoomStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--zoom-s`, `${s}`)
    //p(`--zoom-s-symbols`, `${s}`)
  })
}
*/

function getDeg(m: DOMMatrixReadOnly): number {
  const rad = Math.atan2(m.b, m.a)
  const deg = rad * (180 / Math.PI)
  return deg >= 0 ? deg : deg + 360
}
