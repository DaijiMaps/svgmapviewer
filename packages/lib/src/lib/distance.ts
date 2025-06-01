import type { DistanceRadius } from './distance-types'
import type { Layout } from './layout-types'

export function findRadius(layout: Readonly<Layout>): DistanceRadius {
  return {
    svg: 10,
    client: 10 * layout.svgScale.s,
  }
}
