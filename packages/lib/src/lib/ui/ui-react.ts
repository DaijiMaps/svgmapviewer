import { type RefObject } from 'react'

import { useStyleRef } from '../style/ref'
import { tag, tag2 } from '../style/tag'
import type { OpenClose } from './openclose'

export const UI_ROOT_ID = 'ui'

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
  refMap: Map<string, HTMLDivElement>,
  { open, animating }: OpenClose
): void {
  Array.from(refMap, ([, e]) => {
    tag2(e, 'opened', 'closed', open)
    tag(e, 'animating', animating)
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
