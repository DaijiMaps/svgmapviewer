/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import type { RefObject } from 'react'

import { boxBox, type BoxBox } from '../../box/prefixed'
import { useStyleRef } from '../../style/ref'
import { syncScroll1 } from './scroll'

const scrollRefs: Map<string, HTMLDivElement> = new Map()

export function useScrollRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(scrollRefs, ref, name)
}

export function updateScrollRefs1(
  b: BoxBox,
  name: string
): boolean | undefined {
  const e = scrollRefs.get(name)
  if (!e) return undefined
  return syncScroll1(e, b)
}

export function getScrollRefs1(name: string): BoxBox | undefined {
  const e = scrollRefs.get(name)
  if (!e) return undefined
  const x = e.scrollLeft
  const y = e.scrollTop
  const width = e.scrollWidth
  const height = e.scrollHeight
  return boxBox(x, y, width, height)
}
