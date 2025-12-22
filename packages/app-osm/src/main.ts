import { type OsmRenderConfig, type OsmSearchConfig } from 'svgmapviewer'
import { getMapNames } from 'svgmapviewer/carto'
import {
  osmGetSearchEntries as getSearchEntries,
  osmGetSearchInfo as getSearchInfo,
} from 'svgmapviewer/geo'
import {
  isMapOsmDefaultRendered as isMapRendered,
  RenderMapOsmDefault as renderMap,
} from 'svgmapviewer/map'
import { getMapPaths } from './map/layers'
import { mapSvgStyle } from './map/layers-css'
import { getMapMarkers } from './map/markers'
import { getMapObjects } from './map/objects'
import { getMapSymbols } from './map/symbols'
import { RenderInfo as renderInfo } from './render'
import { osmSearchEntries } from './search-data'

export const renderConfig: OsmRenderConfig = {
  getMapNames, // XXX
  getMapPaths,
  getMapObjects,
  getMapSymbols,
  getMapMarkers,
  mapSvgStyle,
  renderMap,
  isMapRendered,
}

export const searchConfig: OsmSearchConfig = {
  osmSearchEntries,
  getSearchEntries, // XXX
  getSearchInfo, // XXX
  renderInfo,
}
