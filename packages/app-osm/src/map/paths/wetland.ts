import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const wetland: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'wetland',
  filter: (p) => !!p.natural?.match(/wetland/),
}
