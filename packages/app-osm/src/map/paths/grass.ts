import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const grass: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'grass',
  filter: (p) => !!p.landuse?.match(/grass/),
}
