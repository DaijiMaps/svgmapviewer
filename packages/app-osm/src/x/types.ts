import type { Info } from 'svgmapviewer'
import type { FacilityInfo } from './facility/types'
import type { ShopInfo } from './shop/types'

export type XInfo = ShopInfo | FacilityInfo

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
}

export type { Info }
