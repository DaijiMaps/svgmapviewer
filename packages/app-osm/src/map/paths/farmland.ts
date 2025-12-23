import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const farmland: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'farmland',
  filter: (p) => !!p.landuse?.match(/farmland/),
}
