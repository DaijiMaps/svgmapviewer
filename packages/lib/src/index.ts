import { svgMapViewerConfig } from './config'
import { notifyFloorSelectDone } from './lib/event-floor'
import {
  notifySearchEnd,
  notifySearchEndDone,
  notifySearchRequest,
  notifySearchRequestDone,
  notifySearchStart,
} from './lib/event-search'
import {
  notifyStyleLayout,
  notifyStyleResize,
  notifyStyleZoomEnd,
  notifyStyleZoomStart,
} from './lib/event-style'
import {
  notifyUiClose,
  notifyUiCloseDone,
  notifyUiOpen,
  notifyUiOpenDone,
} from './lib/event-ui'
import { Like } from './lib/like/Like'
import { useLayout, useLayout2 } from './lib/style/style-react'
import { useFloors } from './lib/viewer/floors-react'
import { type Layout } from './lib/viewer/layout'
import { svgmapviewer } from './main'
import {
  type Floor,
  type FloorsConfig,
  type Info,
  type OsmDataConfig,
  type OsmGetMapNames,
  type OsmGetSearchEntries,
  type OsmGetSearchInfo,
  type OsmRenderConfig,
  type OsmRenderMap,
  type OsmSearchConfig,
  type POI,
  type RenderAssets,
  type RenderInfo,
  type RenderInfoProps,
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
