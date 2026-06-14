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

// display symbol slightly larger as zoom goes higher
const getK = (zoom: number): number => 0.5 + 0.5 * Math.log2(Math.max(1, zoom))

export function updateMapStyleRefs(
  layout: Readonly<Layout>,
  zoom: number
): void {
  const k = getK(zoom)
  const sz = layout.config.fontSize * layout.svgScale * getK(zoom)
  Array.from(mapStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--map-symbol-size`, `${sz / 72}`)
    p(`--map-symbol-size-k`, `${k}`)
  })
}

/*
type SymbolSizeData = Readonly<{
  readonly layout: Layout
  readonly zoom: number
  readonly s: number
}>
type SymbolSizeValues = number

function getCurrentSymbolSizeValues(
  { layout, zoom, s }: SymbolSizeData,
  t: number
): SymbolSizeValues {
  const sz =
    layout.config.fontSize *
    // display symbol slightly larger as zoom goes higher
    (0.5 + 0.5 * Math.log2(Math.max(1, zoom))) *
    layout.svgScale
  const a = sz / 72
  const b = a * s
  return lerp(a, b, 1 / easeCubic(t))
}

function tickMapStyleRefs(t: number, cbdata?: SymbolSizeData): void {
  if (!cbdata) return
  const symbolSize = getCurrentSymbolSizeValues(cbdata, t)
  Array.from(mapStyleRefs, ([, e]) => {
    const p = e.style.setProperty.bind(e.style)
    p(`--map-symbol-size`, `${symbolSize}`)
  })
}
*/
