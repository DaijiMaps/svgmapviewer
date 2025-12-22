import { RenderMapPaths } from './layers'
import { RenderMapMarkers, RenderMarkers } from './markers'
import { getMapNames } from './names'
import { RenderMapObjects, RenderObjects } from './objects'
import { RenderMapCommon } from './render'
import { RenderMapSymbols, RenderUses } from './symbols'
import {
  type MapLinePaths,
  type MapMultiPolygonPaths,
  type OsmCartoConfig,
  type OsmMapMarkers,
  type OsmMapObjects,
  type OsmMapPaths,
  type OsmMapSymbols,
  type RenderMapMarkersProps,
  type RenderMapSymbolsProps,
} from './types'

// XXX

export { type OsmCartoConfig }

//// paths

export { type OsmMapPaths, type MapLinePaths, type MapMultiPolygonPaths }

export { RenderMapPaths }

//// objects

export { type OsmMapObjects }

export { RenderMapObjects, RenderObjects }

//// symbols

export { type OsmMapSymbols, type RenderMapSymbolsProps }

export { RenderMapSymbols, RenderUses }

//// markers

export { type OsmMapMarkers, type RenderMapMarkersProps }

export { RenderMapMarkers, RenderMarkers }

//// names

export { getMapNames }

//// common map render

export { RenderMapCommon }
