import { type Info, type POI } from 'svgmapviewer'

//import { type XInfo } from './x/types'

declare module 'svgmapviewer' {
  interface Info {
    x?: string
  }
  interface POI {
    x?: string
  }
}

export { type Info, type POI }
