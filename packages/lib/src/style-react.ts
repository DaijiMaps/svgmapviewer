import { boxToViewBox2, type BoxBox } from './lib/box/prefixed'
import { type DistanceRadius } from './lib/distance-types'
import { trunc2 } from './lib/utils'
import { type VecVec } from './lib/vec/prefixed'
import { type Layout, type LayoutConfig } from './lib/viewer/layout'
import { type AnimationMatrix, type Range } from './types'
import { useStyleContext } from './style-xstate'

export function useRendered(): boolean {
  return useStyleContext().rendered
}
export function useAppearing(): boolean {
  return useStyleContext().appearing
}
export function useShown(): boolean {
  return useStyleContext().shown
}
export function useAnimating(): boolean {
  return useStyleContext().animating
}
export function useLayout(): Layout {
  return useStyleContext().layout
}
export function useLayoutContainer(): BoxBox {
  return useStyleContext().layout.container
}
export function useLayoutScroll(): BoxBox {
  return useStyleContext().layout.scroll
}
export function useMode(): string {
  return useStyleContext().mode
}
export function useAnimation(): null | AnimationMatrix {
  return useStyleContext().animation
}
export function useGeoPoint(): VecVec {
  return useStyleContext().geoPoint
}
export function useDistanceRadius(): DistanceRadius {
  return useStyleContext().distanceRadius
}
export function useSvgRange(): Range {
  return useStyleContext().geoRange
}
export function useLayoutConfig(): LayoutConfig {
  return useStyleContext().layout.config
}
export function useLayoutSvgScaleS(): number {
  return useStyleContext().layout.svgScale.s
}
export function useLayoutContent(): DOMMatrixReadOnly {
  return useStyleContext().layout.content
}
export function useZoom(): number {
  return useStyleContext().zoom
}
export function useRotate(): null | number {
  return useStyleContext().rotate
}
export function useLayout2(): {
  viewBox: string
  width: number
  height: number
} {
  const { scroll, svg } = useLayout()

  return {
    viewBox: boxToViewBox2(svg),
    width: trunc2(scroll.width),
    height: trunc2(scroll.height),
  }
}
