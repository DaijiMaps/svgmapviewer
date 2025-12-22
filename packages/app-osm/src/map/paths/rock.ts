import type { MapMultiPolygonPaths } from 'svgmapviewer/carto'

export const rock: MapMultiPolygonPaths = {
  type: 'multipolygon',
  name: 'rock',
  filter: (p) => !!p.natural?.match(/rock|bare_rock/),
}
