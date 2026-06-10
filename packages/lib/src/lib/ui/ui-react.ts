import { useEffect, type RefObject } from 'react'

import { shadowRootMap } from '../dom'
import type { OpenClose } from './openclose'
import type { UiDetailContent } from './ui-types'
import { useUiContext } from './ui-xstate'

export const UI_ROOT_ID = 'ui'

// XXX
export function resetDetailScroll(): void {
  shadowRootMap.get('detail')?.querySelector('.detail')?.scroll(0, 0)
}

////

export function useDetail(): UiDetailContent {
  return useUiContext().detail
}

export function useOpenCloseDetail(): OpenClose {
  return useUiContext().m['detail']
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
    e.classList.remove(open ? 'closed' : `opened`)
    e.classList.add(!open ? 'closed' : `opened`)
    e.classList.remove(animating ? 'not-animating' : 'animating')
    e.classList.add(!animating ? 'not-animating' : 'animating')
  })
}
