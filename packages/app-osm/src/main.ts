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
import { getMapMarkers } from './map/markers'
import { getMapObjects } from './map/objects'
import { getMapPaths } from './map/paths'
import { mapSvgStyle } from './map/paths-css'
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
