import type { AddressEntries, SearchAddressRes, SearchContext } from './address'
import { initAddresses, searchAddress } from './address'
import { svgMapViewerConfig } from './config'
import { svgmapviewer } from './svgmapviewer'
import type {
  Info,
  SearchReq,
  SearchRes,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
} from './types'

// types

export type { Info, SearchReq, SearchRes }

// svgmapviewer

export { svgmapviewer }

// config

export type { SvgMapViewerConfig, SvgMapViewerConfigUser }

export { svgMapViewerConfig }

// address

export type { AddressEntries, SearchAddressRes, SearchContext }

export { initAddresses, searchAddress }
