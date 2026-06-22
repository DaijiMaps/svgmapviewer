/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

import { boxToViewBox2 } from '../box/prefixed'
import { useStyleRef } from '../style/ref'
import { tag, tag2 } from '../style/tag'
import type { BalloonPaths, BalloonProps } from './balloon-common'
import { calcBalloonStyleParams, updateBalloonStyle } from './balloon-common'
import type { OpenClose } from './openclose'

////

const headerStyleRefs: Map<string, HTMLDivElement> = new Map()
const detailStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useHeaderStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(headerStyleRefs, ref, name)
}

export function updateHeaderStyleRefs(oc: OpenClose): void {
  updateCommonStyleRefs(headerStyleRefs, oc)
}

export function useDetailStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(detailStyleRefs, ref, name)
}

export function updateDetailStyleRefs(oc: OpenClose): void {
  updateCommonStyleRefs(detailStyleRefs, oc)
}

function updateCommonStyleRefs(
  refMap: Readonly<Map<string, HTMLDivElement>>,
  { open, animating }: OpenClose
): void {
  Array.from(refMap, ([, e]) => {
    tag2(e, 'opened', 'closed', open)
    tag(e, 'animating', animating)
  })
}

////

const balloonStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useBalloonStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(balloonStyleRefs, ref, name)
}

export function updateBalloonStyleRefs(
  { _p, _hv, _size, _leg }: Readonly<BalloonProps>,
  oc: OpenClose
): void {
  const param = calcBalloonStyleParams(_p, _hv, _size, _leg, oc)
  Array.from(balloonStyleRefs, ([, e]) => {
    updateBalloonStyle(e, param)
  })
}

////

const balloonSvgStyleRefs: Map<string, SVGSVGElement> = new Map()
const balloonBgPathStyleRefs: Map<string, SVGPathElement> = new Map()
const balloonFgPathStyleRefs: Map<string, SVGPathElement> = new Map()

export function useBalloonPathStyleRef(
  svg: Readonly<RefObject<SVGSVGElement | null>>,
  bg: Readonly<RefObject<SVGPathElement | null>>,
  fg: Readonly<RefObject<SVGPathElement | null>>,
  name: string
): void {
  useStyleRef(balloonSvgStyleRefs, svg, name)
  useStyleRef(balloonBgPathStyleRefs, bg, name)
  useStyleRef(balloonFgPathStyleRefs, fg, name)
}

export function updateBalloonPathStyleRefs({
  viewBox,
  width,
  height,
  bg,
  fg,
}: Readonly<BalloonPaths>): void {
  Array.from(balloonSvgStyleRefs, ([, e]) => {
    e.setAttribute('viewBox', boxToViewBox2(viewBox))
    e.setAttribute('width', `${width}`)
    e.setAttribute('height', `${height}`)
  })
  Array.from(balloonBgPathStyleRefs, ([, e]) => e.setAttribute('d', bg))
  Array.from(balloonFgPathStyleRefs, ([, e]) => e.setAttribute('d', fg))
}

////

const detailScrollStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useDetailScrollStyleRefs(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(detailScrollStyleRefs, ref, name)
}

export function updateDetailScrollStyleRefs({
  open,
  animating,
}: OpenClose): void {
  if (open || animating) return
  Array.from(detailScrollStyleRefs, ([, e]) => {
    e.scroll(0, 0)
  })
}
