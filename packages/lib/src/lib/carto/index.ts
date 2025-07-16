import { RenderMapLayers2 } from './layers'
import { RenderMapMarkers, RenderMarkers } from './markers'
import { getMapNames } from './names'
import { RenderMapObjects, RenderObjects } from './objects'
import {
  renderAreasPath2,
  renderLinePath2,
  renderMultiPolygonPath2,
} from './path'
import { RenderMapCommon } from './render'
import { RenderMapSymbols, RenderUses } from './symbols'
import {
  type CartoConfig,
  type MapLayer,
  type MapLineLayer,
  type MapMarkers,
  type MapMultiPolygonLayer,
  type MapObjects,
  type MapSymbols,
  type RenderMapMarkersProps,
  type RenderMapSymbolsProps,
} from './types'

// XXX

export { renderAreasPath2, renderLinePath2, renderMultiPolygonPath2 }

export { type CartoConfig }

//// layers

export { type MapLayer, type MapLineLayer, type MapMultiPolygonLayer }

export { RenderMapLayers2 }

//// objects

export { type MapObjects }

export { RenderMapObjects, RenderObjects }

//// symbols

export { type MapSymbols, type RenderMapSymbolsProps }

export { RenderMapSymbols, RenderUses }

//// markers

export { type MapMarkers, type RenderMapMarkersProps }

export { RenderMapMarkers, RenderMarkers }

//// names

export { getMapNames }

//// common map render

export { RenderMapCommon }
