import { Like } from './Like'
import {
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
  svgMapViewerConfig,
} from './config'
import { type Layout } from './lib/viewer/layout'
import { useLayout, useLayout2 } from './style-xstate'
import { svgmapviewer } from './svgmapviewer'
import {
  type DataConfig,
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
  type RenderConfig,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
}

export { svgmapviewer }

// layout

export { type Layout }

// like

export { Like }

// style

export { useLayout, useLayout2 }
