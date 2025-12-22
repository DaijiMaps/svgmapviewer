import type { MapLinePaths } from 'svgmapviewer/carto'

export const fence: MapLinePaths = {
  type: 'line',
  name: 'fence',
  filter: (p) => !!p.barrier?.match(/^(fence)$/),
}
