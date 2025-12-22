import type { MapLinePaths } from 'svgmapviewer/carto'

export const steps: MapLinePaths = {
  type: 'line',
  name: 'steps',
  width: 1,
  filter: (p) => !!p.highway?.match(/^(steps)$/),
}
