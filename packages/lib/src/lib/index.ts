import { Like } from '../Like'
import {
  RenderMapDefault,
  RenderMapOsmDefault,
  isMapRenderedOsmDefault,
} from '../Map'
import { svgMapViewerConfig } from './config'
import {
  configActorStart,
  configSend,
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
  registerCbs,
  useConfigMapNames,
} from './config-xstate'
import { type Layout } from './layout'
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

export {
  configActorStart,
  configSend,
  registerCbs,
  svgMapViewerConfig,
  useConfigMapNames,
}

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

// map

export { RenderMapDefault, RenderMapOsmDefault, isMapRenderedOsmDefault }
