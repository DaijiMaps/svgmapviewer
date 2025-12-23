import type { MapLinePathOps } from 'svgmapviewer/carto'

export const cycleway: MapLinePathOps = {
  type: 'line',
  name: 'cycleway',
  width: 3,
  filter: (p) => !!p.highway?.match(/^(cycleway)$/),
}
