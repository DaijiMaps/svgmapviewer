/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import type { RefObject } from 'react'

import type { Layout } from './layout-types'

export const layoutRefs: Map<
  string,
  RefObject<HTMLDivElement | null>
> = new Map()

export function updateLayoutRefs(layout: Readonly<Layout>): void {
  Array.from(layoutRefs, ([, ref]) => {
    const e = ref.current
    if (!e) return
    const s = e.style.setProperty.bind(e.style)
    s(`--layout-content-matrix`, layout.content.toString())
    s(`--layout-scroll-width`, `${layout.scroll.width}px`)
    s(`--layout-scroll-height`, `${layout.scroll.height}px`)
  })
}
