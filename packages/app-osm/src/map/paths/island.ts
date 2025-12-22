import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const island: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'island',
  filter: (p) => !!p.natural?.match(/^coastline$/),
}
