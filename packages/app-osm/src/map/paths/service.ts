import type { MapLinePathOps } from 'svgmapviewer/carto'

export const service: MapLinePathOps = {
  type: 'line',
  name: 'service',
  width: 4,
  filter: (p) => !!p.highway?.match(/^(service)$/),
}
