import { type OsmRenderConfig, type OsmSearchConfig } from 'svgmapviewer'
import { getMapNames } from 'svgmapviewer/carto'
import { getAddressEntries, getAddressInfo } from 'svgmapviewer/geo'
import {
  isMapOsmDefaultRendered as isMapRendered,
  RenderMapOsmDefault as renderMap,
} from 'svgmapviewer/map'
import { getMapLayers } from './map-layers'
import { mapSvgStyle } from './map-layers-css'
import { getMapMarkers } from './map-markers'
import { getMapObjects } from './map-objects'
import { getMapSymbols } from './map-symbols'
import { RenderInfo as renderInfo } from './render'
import { searchEntries } from './search-data'

export const renderConfig: OsmRenderConfig = {
  getMapLayers,
  getMapObjects,
  getMapSymbols,
  getMapMarkers,
  mapSvgStyle,
  renderMap,
  isMapRendered,
}

export const searchConfig: OsmSearchConfig = {
  searchEntries,
  getMapNames, // XXX
  getAddressEntries, // XXX
  getAddressInfo, // XXX
  renderInfo,
}
