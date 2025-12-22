import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const roof: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'roof',
  filter: (p) => !!p.building?.match(/./) && !!p.building?.match(/roof/),
}
