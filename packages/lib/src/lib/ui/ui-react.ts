import { useEffect, type RefObject } from 'react'

import { shadowRootMap } from '../dom'
import { tag, tag2 } from '../style/tag'
import type { OpenClose } from './openclose'

export const UI_ROOT_ID = 'ui'

// XXX
export function resetDetailScroll(): void {
  shadowRootMap.get('detail')?.querySelector('.detail')?.scroll(0, 0)
}

////

const headerStyleRefs: Map<string, HTMLDivElement> = new Map()
const detailStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useHeaderStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useCommonStyleRef(headerStyleRefs, ref, name)
}

export function updateHeaderStyleRefs(oc: OpenClose): void {
  updateCommonStyleRefs(headerStyleRefs, oc)
}

export function useDetailStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useCommonStyleRef(detailStyleRefs, ref, name)
}

export function updateDetailStyleRefs(oc: OpenClose): void {
  updateCommonStyleRefs(detailStyleRefs, oc)
}

export function useCommonStyleRef(
  refMap: Map<string, HTMLDivElement>,
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useEffect(() => {
    const e = ref.current
    if (e) refMap.set(name, e)
    return () => {
      if (e) refMap.delete(name)
    }
  }, [name, ref, refMap])
}

export function updateCommonStyleRefs(
  refMap: Map<string, HTMLDivElement>,
  { open, animating }: OpenClose
): void {
  Array.from(refMap, ([, e]) => {
    tag2(e, 'opened', 'closed', open)
    tag(e, 'animating', animating)
  })
}
