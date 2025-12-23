import type { MapLinePathOps } from 'svgmapviewer/carto'

export const pedestrian: MapLinePathOps = {
  type: 'line',
  name: 'pedestrian',
  width: 8,
  filter: (p) => !!p.highway?.match(/^(pedestrian)$/),
}
