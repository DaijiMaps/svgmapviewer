/* eslint-disable functional/functional-parameters */
import { getConfig } from 'svgmapviewer'
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
  const cfg = getConfig()
  return cfg.cartoConfig?.internals ?? cfg.mapData.internals
}
