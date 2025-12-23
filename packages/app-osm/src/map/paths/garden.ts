import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const garden: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'garden',
  filter: (p) => !!p.leisure?.match(/garden/),
}
