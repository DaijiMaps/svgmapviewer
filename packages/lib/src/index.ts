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
  type OsmDataConfig,
  type Floor,
  type FloorsConfig,
  type OsmGetMapNames,
  type OsmGetAddressEntries,
  type OsmGetAddressInfo,
  type Info,
  type OsmRenderConfig,
  type OsmSearchConfig,
  type POI,
  type RenderAssets,
  type RenderInfo,
  type RenderInfoProps,
  type OsmRenderMap,
  type SearchReq,
  type SearchRes,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
  type UiConfig,
} from './types'

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

// types

export {
  type OsmDataConfig,
  type Floor,
  type FloorsConfig,
  type OsmGetMapNames,
  type OsmGetAddressEntries,
  type OsmGetAddressInfo,
  type Info,
  type OsmRenderConfig,
  type OsmSearchConfig,
  type POI,
  type RenderAssets,
  type RenderInfo,
  type RenderInfoProps,
  type OsmRenderMap,
  type SearchReq,
  type SearchRes,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
  type UiConfig,
}

export { svgmapviewer }

// viewer

export { type Layout }

export { useFloors }

// like

export { Like }

// style

export { useLayout, useLayout2 }
