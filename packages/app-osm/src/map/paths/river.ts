import type { MapLinePaths } from 'svgmapviewer/carto'

export const river: MapLinePaths = {
  type: 'line',
  name: 'river',
  filter: (p) => !!p.waterway?.match(/^(river)$/),
}
