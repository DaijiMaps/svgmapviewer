import { RenderMapPaths } from './layers'
import { RenderMapMarkers, RenderMarkers } from './markers'
import { getMapNames } from './names'
import { RenderMapObjects, RenderObjects } from './objects'
import { RenderMapCommon } from './render'
import { RenderMapSymbols, RenderUses } from './symbols'
import {
  type MapLineLayer,
  type MapMultiPolygonLayer,
  type OsmCartoConfig,
  type OsmMapLayer,
  type OsmMapMarkers,
  type OsmMapObjects,
  type OsmMapSymbols,
  type RenderMapMarkersProps,
  type RenderMapSymbolsProps,
} from './types'

// XXX

export { type OsmCartoConfig }

//// layers

export { type OsmMapLayer, type MapLineLayer, type MapMultiPolygonLayer }

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
