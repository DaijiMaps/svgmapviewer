import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const grave_yard: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'grave_yard',
  filter: (p) => !!p.amenity?.match(/grave_yard/),
}
