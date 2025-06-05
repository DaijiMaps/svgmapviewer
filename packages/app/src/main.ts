import { RenderConfig } from '@daijimaps/svgmapviewer'
import { getMapNames } from '@daijimaps/svgmapviewer/carto'
import { getMapLayers } from './map-layers'
import { getMapMarkers } from './map-markers'
import { getMapObjects } from './map-objects'
import { getMapSymbols } from './map-symbols'
import { RenderInfo } from './render'
import { searchEntries } from './search-data'

export const renderConfig: RenderConfig = {
  getMapLayers,
  getMapObjects,
  getMapSymbols,
  getMapMarkers,
  getMapNames,
  searchEntries,
  renderInfo: RenderInfo,
}
