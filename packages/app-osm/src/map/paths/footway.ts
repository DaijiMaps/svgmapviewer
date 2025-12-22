import type { MapLinePaths } from 'svgmapviewer/carto'

export const footway: MapLinePaths = {
  type: 'line',
  name: 'footway',
  width: 1,
  filter: (p) => !!p.highway?.match(/^(footway|steps)$/),
}
