import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const island: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'island',
  filter: (p) => !!p.natural?.match(/^coastline$/),
}
