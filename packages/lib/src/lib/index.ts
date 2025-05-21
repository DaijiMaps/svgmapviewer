import { Like } from '../Like'
import { svgMapViewerConfig } from './config'
import type { ConfigMachine, ConfigState } from './config-xstate'
import { configActor, configContext, selectMapNames } from './config-xstate'
import { Layout } from './layout'
import { svgmapviewer } from './svgmapviewer'
import type {
  Info,
  RenderMap,
  SearchReq,
  SearchRes,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
} from './types'

// types

export type { Info, RenderMap, SearchReq, SearchRes }

// svgmapviewer

export type { ConfigMachine, ConfigState }

export { configActor, configContext, selectMapNames, svgMapViewerConfig }

// svgmapviewer

export type { SvgMapViewerConfig, SvgMapViewerConfigUser }

export { svgmapviewer }

// layout

export type { Layout }

// like

export { Like }
