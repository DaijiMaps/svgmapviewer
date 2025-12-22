import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const wetland: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'wetland',
  filter: (p) => !!p.natural?.match(/wetland/),
}
