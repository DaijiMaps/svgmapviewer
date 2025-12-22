import type { MapLinePaths } from 'svgmapviewer/carto'

export const cycleway: MapLinePaths = {
  type: 'line',
  name: 'cycleway',
  width: 3,
  filter: (p) => !!p.highway?.match(/^(cycleway)$/),
}
