import type { MapLinePathOps } from 'svgmapviewer/carto'

export const cliff: MapLinePathOps = {
  type: 'line',
  name: 'cliff',
  filter: (p) => !!p.other_tags?.match(/"natural"=>"(cliff)"/),
}
