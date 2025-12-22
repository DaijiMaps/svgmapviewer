import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const forest: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'forest',
  filter: (p) => !!p.landuse?.match(/forest/) || !!p.natural?.match(/wood/),
}
