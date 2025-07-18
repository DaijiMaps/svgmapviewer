import { svgMapViewerConfig } from './config'
import {
  notifyFloorDone,
  notifyLayout,
  notifyResize,
  notifySearch,
  notifySearchDone,
  notifySearchEnd,
  notifySearchEndDone,
  notifySearchStart,
  notifyUiClose,
  notifyUiCloseDone,
  notifyUiOpen,
  notifyUiOpenDone,
  notifyZoomEnd,
  notifyZoomStart,
} from './event'
import { Like } from './lib/Like'
import { useFloors } from './lib/viewer/floors-xstate'
import { type Layout } from './lib/viewer/layout'
import { svgmapviewer } from './main'
import { useLayout, useLayout2 } from './style-xstate'
import {
  type DataConfig,
  type FloorsConfig,
  type Info,
  type RenderConfig,
  type RenderMap,
  type SearchReq,
  type SearchRes,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
} from './types'

// types

export { type Info, type RenderMap, type SearchReq, type SearchRes }

// svgmapviewer

export { svgMapViewerConfig }

export {
  notifyFloorDone,
  notifyLayout,
  notifyResize,
  notifySearch,
  notifySearchDone,
  notifySearchEnd,
  notifySearchEndDone,
  notifySearchStart,
  notifyUiClose,
  notifyUiCloseDone,
  notifyUiOpen,
  notifyUiOpenDone,
  notifyZoomEnd,
  notifyZoomStart,
}

// svgmapviewer

export {
  type DataConfig,
  type FloorsConfig,
  type RenderConfig,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
}

export { svgmapviewer }

// viewer

export { type Layout }

export { useFloors }

// like

export { Like }

// style

export { useLayout, useLayout2 }
