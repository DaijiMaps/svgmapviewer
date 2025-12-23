import type { MapLinePathOps } from 'svgmapviewer/carto'

export const steps: MapLinePathOps = {
  type: 'line',
  name: 'steps',
  width: 1,
  filter: (p) => !!p.highway?.match(/^(steps)$/),
}
