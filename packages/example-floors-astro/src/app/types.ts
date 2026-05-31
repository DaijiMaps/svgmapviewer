import { type Info } from 'svgmapviewer'

import type { CafeInfo, RestaurantInfo } from './schema'

type XInfo = CafeInfo | RestaurantInfo

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
}

export { type Info }
