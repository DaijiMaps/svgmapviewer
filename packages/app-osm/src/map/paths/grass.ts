import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const grass: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'grass',
  filter: (p) => !!p.landuse?.match(/grass/),
}
