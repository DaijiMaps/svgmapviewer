import type { MapLinePaths } from 'svgmapviewer/carto'

export const service: MapLinePaths = {
  type: 'line',
  name: 'service',
  width: 4,
  filter: (p) => !!p.highway?.match(/^(service)$/),
}
