import type { MapLinePaths } from 'svgmapviewer/carto'

export const pedestrian: MapLinePaths = {
  type: 'line',
  name: 'pedestrian',
  width: 8,
  filter: (p) => !!p.highway?.match(/^(pedestrian)$/),
}
