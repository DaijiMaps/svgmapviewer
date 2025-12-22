import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const water: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'water',
  filter: (p) => !!p.natural?.match(/^water$/),
}
