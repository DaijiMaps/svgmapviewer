import { useEffect, type RefObject } from 'react'

import { type Range } from '../../types'
import { boxToViewBox2, type BoxBox } from '../box/prefixed'
import { type DistanceRadius } from '../distance-types'
import { type VecVec } from '../vec/prefixed'
import { type Layout, type LayoutConfig } from '../viewer/layout/layout'
import { useStyleContext } from './style-xstate'

export function useRendered(): boolean {
  return useStyleContext((ctx) => ctx.rendered)
}
export function useAppearing(): boolean {
  return useStyleContext((ctx) => ctx.appearing)
}
export function useShown(): boolean {
  return useStyleContext((ctx) => ctx.shown)
}
export function useAnimating(): boolean {
  return useStyleContext((ctx) => ctx.animating)
}
export function useLayout(): Layout {
  return useStyleContext((ctx) => ctx.layout)
}
export function useLayoutContainer(): BoxBox {
  return useStyleContext((ctx) => ctx.layout.container)
}
export function useMode(): string {
  return useStyleContext((ctx) => ctx.mode)
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
export function useZoom(): number {
  return useStyleContext((ctx) => ctx.zoom)
}
export function useLayout2(): {
  viewBox: string
} {
  const { svg } = useLayout()

  return {
    viewBox: boxToViewBox2(svg),
  }
}

export function useZoomingStyle(ref: RefObject<HTMLDivElement | null>): void {
  const zooming = useAnimating()

  useEffect(() => {
    if (ref.current === null) return
    if (zooming) {
      ref.current.classList.add('zooming')
      ref.current.classList.remove('not-zooming')
    } else {
      ref.current.classList.remove('zooming')
      ref.current.classList.add('not-zooming')
    }
  }, [ref, zooming])
}
