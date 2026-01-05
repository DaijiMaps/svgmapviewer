import { svgMapViewerConfig } from './config'
import { Like } from './lib/like/Like'
import { useLayout, useLayout2 } from './lib/style/style-react'
import { useFloors } from './lib/viewer/floors/floors-react'
import { type Layout } from './lib/viewer/layout/layout'
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
  type SearchSvgReq,
  type SearchRes,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
  type UiConfig,
} from './types'

// svgmapviewer

export { svgMapViewerConfig }

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
  type SearchSvgReq,
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
