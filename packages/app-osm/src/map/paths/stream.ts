import type { MapLinePathOps } from 'svgmapviewer/carto'

export const stream: MapLinePathOps = {
  type: 'line',
  name: 'stream',
  filter: (p) => !!p.waterway?.match(/^(stream)$/),
}
