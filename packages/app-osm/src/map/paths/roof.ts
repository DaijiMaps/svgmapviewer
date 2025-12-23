import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const roof: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'roof',
  filter: (p) => !!p.building?.match(/./) && !!p.building?.match(/roof/),
}
