/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useEffect, type RefObject } from 'react'

import type { Layout } from '../viewer/layout/layout'

const mapStyleRefs: Map<string, RefObject<SVGGElement | null>> = new Map()

export function useMapStyleRef(
  ref: Readonly<RefObject<SVGGElement | null>>
): void {
  useEffect(() => {
    const e = ref.current
    if (e) mapStyleRefs.set('map-symbols', ref)
    return () => {
      if (e) mapStyleRefs.delete('map-symbols')
    }
  }, [ref])
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
  Array.from(mapStyleRefs, ([, ref]) => {
    const e = ref.current
    if (!e) return
    const s = e.style.setProperty.bind(e.style)
    s(`--map-symbol-syze`, `${sz}`)
  })
}
