import { type Info, type POI } from 'svgmapviewer'

import { type XInfo } from './x/types'

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
  interface POI {
    x: XInfo
  }
}

export { type Info, type POI }
