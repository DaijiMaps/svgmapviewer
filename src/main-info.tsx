import type { Info } from './lib/types'

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

declare module './lib/types' {
  interface Info {
    x: ShopInfo | FacilityInfo
  }
}

export type { Info }
