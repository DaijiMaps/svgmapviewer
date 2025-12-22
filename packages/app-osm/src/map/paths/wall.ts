import type { MapLinePaths } from 'svgmapviewer/carto'

export const wall: MapLinePaths = {
  type: 'line',
  name: 'wall',
  filter: (p) => !!p.barrier?.match(/^(wall)$/),
}
