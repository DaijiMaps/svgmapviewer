import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const water: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'water',
  filter: (p) => !!p.natural?.match(/^water$/),
}
