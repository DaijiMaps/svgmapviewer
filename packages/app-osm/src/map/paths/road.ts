import type { MapLinePaths } from 'svgmapviewer/carto'

export const road: MapLinePaths = {
  type: 'line',
  name: 'road',
  width: 6,
  filter: (p) =>
    !!p.highway?.match(/./) &&
    !p.highway?.match(
      /^(footway|path|pedestrian|steps|cycleway|track|service)$/
    ),
}
