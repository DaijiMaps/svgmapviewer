import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const grave_yard: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'grave_yard',
  filter: (p) => !!p.amenity?.match(/grave_yard/),
}
