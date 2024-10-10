import { Info } from '@daijimaps/svgmapviewer'

export interface ShopInfo {
  tag: 'shop'
  name?: string
  address?: string
}

export interface FacilityInfo {
  tag: 'facility'
  name?: string
  address?: string
}

declare module '@daijimaps/svgmapviewer' {
  interface Info {
    x: ShopInfo | FacilityInfo
  }
}

export type { Info }
