import type { MapMultiPolygonPathOps } from 'svgmapviewer/carto'

export const rock: MapMultiPolygonPathOps = {
  type: 'multipolygon',
  name: 'rock',
  filter: (p) => !!p.natural?.match(/rock|bare_rock/),
}
