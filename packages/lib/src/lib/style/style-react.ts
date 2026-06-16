import { type Range } from '../../types'
import { boxToViewBox2, type BoxBox } from '../box/prefixed'
import { type DistanceRadius } from '../distance-types'
import { type VecVec } from '../vec/prefixed'
import { type Layout, type LayoutConfig } from '../viewer/layout/layout'
import { useStyleContext } from './style-xstate'

export function useRendered(): boolean {
  return useStyleContext((ctx) => ctx.rendered)
}
export function useLayout(): Layout {
  return useStyleContext((ctx) => ctx.layout)
}
export function useLayoutSvg(): BoxBox {
  return useStyleContext((ctx) => ctx.layout.svg)
}
export function useLayoutContainer(): BoxBox {
  return useStyleContext((ctx) => ctx.layout.container)
}
export function useGeoPoint(): VecVec {
  return useStyleContext((ctx) => ctx.geoPoint)
}
export function useDistanceRadius(): DistanceRadius {
  return useStyleContext((ctx) => ctx.distanceRadius)
}
export function useSvgRange(): Range {
  return useStyleContext((ctx) => ctx.geoRange)
}
export function useLayoutConfig(): LayoutConfig {
  return useStyleContext((ctx) => ctx.layout.config)
}
export function useLayoutSvgScaleS(): number {
  return useStyleContext((ctx) => ctx.layout.svgScale)
}
export function useLayout2(): {
  viewBox: string
} {
  const { svg } = useLayout()

  return {
    viewBox: boxToViewBox2(svg),
  }
}
