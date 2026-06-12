/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

import { useStyleRef } from '../style/ref'
import type { Layout } from '../viewer/layout/layout'

const mapStyleRefs: Map<string, SVGGElement> = new Map()

export function useMapStyleRef(
  ref: Readonly<RefObject<SVGGElement | null>>,
  name: string
): void {
  useStyleRef(mapStyleRefs, ref, name)
}

export function updateMapStyleRefs(
  layout: Readonly<Layout>,
  zoom: number
): void {
  const sz =
    layout.config.fontSize *
    // display symbol slightly larger as zoom goes higher
    (0.5 + 0.5 * Math.log2(Math.max(1, zoom))) *
    layout.svgScale
  Array.from(mapStyleRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    s(`--map-symbol-size`, `${sz / 72}`)
  })
}
