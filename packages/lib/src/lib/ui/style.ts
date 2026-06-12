/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

import { useStyleRef } from '../style/ref'
import { tag, tag2 } from '../style/tag'
import { calcBalloonLayout, updateBalloonStyle } from './balloon-common'
import type { OpenClose } from './openclose'
import type { UiDetailContent } from './ui-types'

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
  detail: Readonly<UiDetailContent>,
  oc: OpenClose
): void {
  const { _p, _hv, _size, _leg } = calcBalloonLayout(detail)
  Array.from(balloonStyleRefs, ([, e]) => {
    updateBalloonStyle(e, _p, _hv, _size, _leg, oc)
  })
}

////

const scrollStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useScrollStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(scrollStyleRefs, ref, name)
}

export function updateScrollStyleRefs({ open, animating }: OpenClose): void {
  if (open || animating) return
  Array.from(scrollStyleRefs, ([, e]) => {
    e.scroll(0, 0)
  })
}
