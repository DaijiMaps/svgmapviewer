/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useEffect, type RefObject } from 'react'

import { trunc2 } from '../../utils'
import type { Layout } from './layout-types'

const layoutStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useLayoutStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>
): void {
  useEffect(() => {
    const e = ref.current
    if (e) layoutStyleRefs.set('map-symbols', e)
    return () => {
      if (e) layoutStyleRefs.delete('map-symbols')
    }
  }, [ref])
}

export function updateLayoutStyleRefs(layout: Readonly<Layout>): void {
  Array.from(layoutStyleRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    s(`--layout-content-matrix`, layout.content.toString())
    s(`--layout-scroll-width`, `${trunc2(layout.scroll.width)}px`)
    s(`--layout-scroll-height`, `${trunc2(layout.scroll.height)}px`)
  })
}
