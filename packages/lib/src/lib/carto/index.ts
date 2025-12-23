import { RenderMapMarkers, RenderMarkers } from './markers'
import { getMapNames } from './names'
import { RenderMapObjects, RenderObjects } from './objects'
import { RenderMapPaths } from './paths'
import { RenderMapCommon } from './render'
import { RenderMapSymbols, RenderUses } from './symbols'
import {
  type MapLinePathOps,
  type MapMultiPolygonPathOps,
  type OsmCartoConfig,
  type OsmMapMarkers,
  type OsmMapObjects,
  type OsmMapPathOps,
  type OsmMapSymbols,
  type RenderMapMarkersProps,
  type RenderMapSymbolsProps,
} from './types'

// XXX

export { type OsmCartoConfig }

//// paths

export { type OsmMapPathOps, type MapLinePathOps, type MapMultiPolygonPathOps }

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
