import { type Info, type POI } from 'svgmapviewer'

//import { type XInfo } from './x/types'

interface CafeInfo {
  tag: 'shop.cafe'
  category?: string
}

interface RestaurantInfo {
  tag: 'shop.restaurant'
  nseats?: number
}

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
