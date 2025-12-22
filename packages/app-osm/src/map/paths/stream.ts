import type { MapLinePaths } from 'svgmapviewer/carto'

export const stream: MapLinePaths = {
  type: 'line',
  name: 'stream',
  filter: (p) => !!p.waterway?.match(/^(stream)$/),
}
