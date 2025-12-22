import type { MapLinePaths } from 'svgmapviewer/carto'

export const drain: MapLinePaths = {
  type: 'line',
  name: 'drain',
  filter: (p) => !!p.waterway?.match(/^(drain)$/),
}
