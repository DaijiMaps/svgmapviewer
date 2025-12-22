import type { MapLinePaths } from 'svgmapviewer/carto'

export const ditch: MapLinePaths = {
  type: 'line',
  name: 'ditch',
  filter: (p) => !!p.waterway?.match(/^(ditch)$/),
}
