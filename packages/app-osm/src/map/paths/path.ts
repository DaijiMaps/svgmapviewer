import type { MapLinePathOps } from 'svgmapviewer/carto'

export const path: MapLinePathOps = {
  type: 'line',
  name: 'path',
  width: 1,
  filter: (p) => !!p.highway?.match(/^(path|track)$/),
}
