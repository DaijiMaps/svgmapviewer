import type { AddressEntries, SearchAddressRes, SearchContext } from './address'
import { initAddresses, searchAddress } from './address'
import { svgMapViewerConfig } from './config'
import { Layout } from './layout'
import { svgmapviewer } from './svgmapviewer'
import type {
  Info,
  RenderMap,
  RenderMapProps,
  SearchReq,
  SearchRes,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
} from './types'

// types

export type { Info, RenderMap, RenderMapProps, SearchReq, SearchRes }

// svgmapviewer

export { svgmapviewer }

// config

export type { SvgMapViewerConfig, SvgMapViewerConfigUser }

export { svgMapViewerConfig }

// address

export type { AddressEntries, SearchAddressRes, SearchContext }

export { initAddresses, searchAddress }

// layout

export type { Layout }
