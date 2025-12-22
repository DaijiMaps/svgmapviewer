import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const building: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'building',
  filter: (p) => !!p.building?.match(/./) && !p.building?.match(/roof/),
}
