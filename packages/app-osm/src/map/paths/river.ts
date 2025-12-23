import type { MapLinePathOps } from 'svgmapviewer/carto'

export const river: MapLinePathOps = {
  type: 'line',
  name: 'river',
  filter: (p) => !!p.waterway?.match(/^(river)$/),
}
