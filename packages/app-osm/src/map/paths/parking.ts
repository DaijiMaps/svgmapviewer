import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const parking: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'parking',
  filter: (p) => !!p.amenity?.match(/(parking|bicycle_parking)/),
}
