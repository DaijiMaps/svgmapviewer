import type { MapLinePathOps } from 'svgmapviewer/carto'

export const footway: MapLinePathOps = {
  type: 'line',
  name: 'footway',
  width: 1,
  filter: (p) => !!p.highway?.match(/^(footway|steps)$/),
}
