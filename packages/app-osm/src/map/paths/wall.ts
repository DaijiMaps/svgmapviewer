import type { MapLinePathOps } from 'svgmapviewer/carto'

export const wall: MapLinePathOps = {
  type: 'line',
  name: 'wall',
  filter: (p) => !!p.barrier?.match(/^(wall)$/),
}
