/* eslint-disable functional/functional-parameters */
import { svgMapViewerConfig } from 'svgmapviewer'
import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'
import type { MultiPolygon } from 'svgmapviewer/geo'

export const area: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'area',
  data: () =>
    getInternals().features.map(
      (f) => f.geometry.coordinates
    ) as unknown as MultiPolygon[],
}

function getInternals() {
  return (
    svgMapViewerConfig.cartoConfig?.internals ??
    svgMapViewerConfig.mapData.internals
  )
}
