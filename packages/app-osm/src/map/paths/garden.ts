import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const garden: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'garden',
  filter: (p) => !!p.leisure?.match(/garden/),
}
