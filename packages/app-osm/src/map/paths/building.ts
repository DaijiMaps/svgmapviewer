import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const building: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'building',
  filter: (p) => !!p.building?.match(/./) && !p.building?.match(/roof/),
}
