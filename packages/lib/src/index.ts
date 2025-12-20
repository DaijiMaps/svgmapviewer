import { svgMapViewerConfig } from './config'
import {
  notifyFloorSelectDone,
  notifyStyleLayout,
  notifyStyleResize,
  notifySearchRequest,
  notifySearchRequestDone,
  notifySearchEnd,
  notifySearchEndDone,
  notifySearchStart,
  notifyUiClose,
  notifyUiCloseDone,
  notifyUiOpen,
  notifyUiOpenDone,
  notifyStyleZoomEnd,
  notifyStyleZoomStart,
} from './event'
import { Like } from './lib/Like'
import { useFloors } from './lib/viewer/floors-react'
import { type Layout } from './lib/viewer/layout'
import { svgmapviewer } from './main'
import { useLayout, useLayout2 } from './lib/style/style-react'
import {
  type OsmDataConfig,
  type Floor,
  type FloorsConfig,
  type OsmGetMapNames,
  type OsmGetSearchEntries,
  type OsmGetSearchInfo,
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
  notifyFloorSelectDone,
  notifyStyleLayout,
  notifyStyleResize,
  notifySearchRequest,
  notifySearchRequestDone,
  notifySearchEnd,
  notifySearchEndDone,
  notifySearchStart,
  notifyUiClose,
  notifyUiCloseDone,
  notifyUiOpen,
  notifyUiOpenDone,
  notifyStyleZoomEnd,
  notifyStyleZoomStart,
}

// types

export {
  type OsmDataConfig,
  type Floor,
  type FloorsConfig,
  type OsmGetMapNames,
  type OsmGetSearchEntries,
  type OsmGetSearchInfo,
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
