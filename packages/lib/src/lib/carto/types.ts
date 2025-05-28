import {
  type CentroidsFilter,
  type Line,
  type LinesFilter,
  type MidpointsFilter,
  type MultiPolygon,
  type MultiPolygonsFilter,
  type Point,
  type PointsFilter,
} from '../geo'

//// layers

export type MapLayer = MapLineLayer | MapMultiPolygonLayer

export interface MapLineLayer {
  type: 'line'
  name: string
  width?: number
  filter?: LinesFilter
  data?: Line[]
}

export interface MapMultiPolygonLayer {
  type: 'multipolygon'
  name: string
  filter?: MultiPolygonsFilter
  data?: MultiPolygon[]
}

//// markers

export interface RenderMapMarkersProps {
  mapMarkers: MapMarkers[]
}

export interface MapMarker {
  name: string
  href: string
  data?: Point
}

export interface MapMarkers {
  name: string
  pointsFilter?: PointsFilter
  centroidsFilter?: CentroidsFilter
  midpointsFilter?: MidpointsFilter
  data?: MapMarker[]
}

//// objects

// XXX take size (width/height)
// XXX calc stroke-width (0.05% of width/height)
export interface MapObjects {
  name: string
  path: string
  width: number
  pointsFilter?: PointsFilter
  centroidsFilter?: CentroidsFilter
  midpointsFilter?: MidpointsFilter
  data?: Point[]
}

//// symbols

export interface RenderMapSymbolsProps {
  mapSymbols: MapSymbols[]
}

export interface MapSymbols {
  name: string
  href: string
  pointsFilter?: PointsFilter
  centroidsFilter?: CentroidsFilter
  midpointsFilter?: MidpointsFilter
  data?: Point[]
}
