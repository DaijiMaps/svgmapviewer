import type { MapLinePaths } from 'svgmapviewer/carto'

export const retaining_wall: MapLinePaths = {
  type: 'line',
  name: 'retaining-wall',
  filter: (p) => !!p.barrier?.match(/^(retaining_wall)$/),
}
