import { type OsmRenderConfig } from 'svgmapviewer'
import { getAddressEntries } from 'svgmapviewer/search'
import { getMapNames } from 'svgmapviewer/carto'
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
  getMapNames, // XXX
  getAddressEntries, // XXX
  searchEntries,
  renderInfo,
  mapSvgStyle,
  renderMap,
  isMapRendered,
}
