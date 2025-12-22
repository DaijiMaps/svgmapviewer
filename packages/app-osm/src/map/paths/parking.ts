import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const parking: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'parking',
  filter: (p) => !!p.amenity?.match(/(parking|bicycle_parking)/),
}
