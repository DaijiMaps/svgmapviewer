import type { MapLinePaths } from 'svgmapviewer/carto'

export const cliff: MapLinePaths = {
  type: 'line',
  name: 'cliff',
  filter: (p) => !!p.other_tags?.match(/"natural"=>"(cliff)"/),
}
