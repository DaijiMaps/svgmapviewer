import { SvgMapViewerConfig } from '@daijimaps/svgmapviewer'
import { getMapLayers } from './map-layers'
import { getMapMarkers } from './map-markers'
import { getMapNames } from './map-names'
import { getMapObjects } from './map-objects'
import { getMapSymbols } from './map-symbols'
import { RenderInfo } from './render'
import { searchEntries } from './search-data'

export const appConfig: Partial<SvgMapViewerConfig> = {
  getMapLayers,
  getMapObjects,
  getMapSymbols,
  getMapMarkers,
  getMapNames,
  renderInfo: RenderInfo,
  searchEntries,
}
