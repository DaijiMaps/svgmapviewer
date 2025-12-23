import type { MapLinePathOps } from 'svgmapviewer/carto'

export const ditch: MapLinePathOps = {
  type: 'line',
  name: 'ditch',
  filter: (p) => !!p.waterway?.match(/^(ditch)$/),
}
