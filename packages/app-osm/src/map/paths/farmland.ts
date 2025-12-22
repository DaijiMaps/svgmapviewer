import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const farmland: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'farmland',
  filter: (p) => !!p.landuse?.match(/farmland/),
}
