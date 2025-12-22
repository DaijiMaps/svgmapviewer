import type { MapLinePaths } from 'svgmapviewer/carto'

export const path: MapLinePaths = {
  type: 'line',
  name: 'path',
  width: 1,
  filter: (p) => !!p.highway?.match(/^(path|track)$/),
}
