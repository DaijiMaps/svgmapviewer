import type { MapLinePathOps } from 'svgmapviewer/carto'

export const road: MapLinePathOps = {
  type: 'line',
  name: 'road',
  width: 6,
  filter: (p) =>
    !!p.highway?.match(/./) &&
    !p.highway?.match(
      /^(footway|path|pedestrian|steps|cycleway|track|service)$/
    ),
}
