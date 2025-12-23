import type { MapLinePathOps } from 'svgmapviewer/carto'

export const drain: MapLinePathOps = {
  type: 'line',
  name: 'drain',
  filter: (p) => !!p.waterway?.match(/^(drain)$/),
}
