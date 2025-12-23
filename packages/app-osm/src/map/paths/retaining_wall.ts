import type { MapLinePathOps } from 'svgmapviewer/carto'

export const retaining_wall: MapLinePathOps = {
  type: 'line',
  name: 'retaining-wall',
  filter: (p) => !!p.barrier?.match(/^(retaining_wall)$/),
}
