import { type Info, type POI } from 'svgmapviewer'

import type { CafeInfo, RestaurantInfo } from '../utils/info'

type XInfo = CafeInfo | RestaurantInfo

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
  interface POI {
    x?: string
  }
}

export { type Info, type POI }
