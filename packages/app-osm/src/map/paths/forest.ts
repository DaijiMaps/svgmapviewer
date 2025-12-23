import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const forest: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'forest',
  filter: (p) => !!p.landuse?.match(/forest/) || !!p.natural?.match(/wood/),
}
