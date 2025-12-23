import type { MapLinePathOps } from 'svgmapviewer/carto'

export const fence: MapLinePathOps = {
  type: 'line',
  name: 'fence',
  filter: (p) => !!p.barrier?.match(/^(fence)$/),
}
